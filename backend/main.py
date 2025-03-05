import os
import json
import asyncio
import requests
from datetime import datetime
from fastapi import FastAPI, HTTPException, Form
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from apify_client import ApifyClient

# Boto3 for AWS S3
import boto3
from botocore.exceptions import BotoCoreError, ClientError

###############################
# 1) Upload image bytes to S3
###############################
def upload_image_to_s3(image_url: str, bucket_name: str, destination_key: str) -> str:
    """
    Downloads an image from `image_url` and uploads it to the specified S3 bucket.
    Returns the public URL of the uploaded image.
    """
    # 1) Download the image data (actual bytes)
    response = requests.get(image_url)
    if response.status_code != 200:
        raise Exception(f"Failed to download image: {image_url}")
    image_data = response.content

    # 2) Set up Boto3 S3 client
    aws_region = os.getenv("AWS_REGION", "us-east-2")  # fallback if not set
    s3_client = boto3.client(
        "s3",
        region_name=aws_region,
        # If you omit the credentials here, Boto3 will pick them up
        # from environment variables (AWS_ACCESS_KEY_ID, etc.) or an IAM role.
        # aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        # aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )

    # 3) Upload the bytes to S3
    try:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=destination_key,
            Body=image_data,
            ContentType=response.headers.get("Content-Type", "image/jpeg"), 
            ACL="public-read"  # If you want the URL publicly accessible
        )
    except (BotoCoreError, ClientError) as e:
        raise Exception(f"Error uploading to S3: {e}")

    # 4) Construct the public URL (assuming the object is public)
    # For most regions: "https://<bucket_name>.s3.<region>.amazonaws.com/<destination_key>"
    # If your region is special (like us-east-1), the hostname might be different.
    public_url = f"https://{bucket_name}.s3.{aws_region}.amazonaws.com/{destination_key}"
    return public_url

###############################
# 2) Logic to unify sidecar posts and upload images
###############################
def unify_sidecars(posts: list) -> list:
    """
    If an Instagram post includes multiple images (sidecar),
    Apify may return separate items with the same shortCode.
    This merges them into a single item with 'childPosts'.
    """
    merged = {}
    for p in posts:
        sc = p.get("shortCode")
        if not sc:
            merged[p.get("id", f"unknown_{len(merged)}")] = p
            continue
        if sc not in merged:
            p.setdefault("childPosts", [])
            merged[sc] = p
        else:
            parent = merged[sc]
            parent.setdefault("childPosts", [])
            parent["childPosts"].append(p)
    return list(merged.values())

def process_images_for_post(post: dict, bucket_name: str):
    """
    Upload the main post image bytes to S3, then handle sidecar children if any.
    """
    # 1) Parent image
    image_url = None
    if "images" in post and post["images"]:
        image_url = post["images"][0]
    elif "displayUrl" in post and post["displayUrl"]:
        image_url = post["displayUrl"]

    if image_url:
        try:
            filename = f"{post.get('id','parent_unknown')}_{datetime.now().strftime('%Y%m%d%H%M%S')}.jpg"
            s3_url = upload_image_to_s3(image_url, bucket_name, f"images/{filename}")
            post["uploadedImageUrl"] = s3_url
        except Exception as e:
            print(f"Error uploading parent image for post {post.get('id')}: {e}")
            post["uploadedImageUrl"] = None
    else:
        post["uploadedImageUrl"] = None

    # 2) Child images
    if "childPosts" in post:
        for child in post["childPosts"]:
            child_url = None
            if "images" in child and child["images"]:
                child_url = child["images"][0]
            elif "displayUrl" in child and child["displayUrl"]:
                child_url = child["displayUrl"]

            if child_url:
                try:
                    child_fname = f"{child.get('id','child_unknown')}_{datetime.now().strftime('%Y%m%d%H%M%S')}.jpg"
                    s3_url = upload_image_to_s3(child_url, bucket_name, f"images/{child_fname}")
                    child["uploadedImageUrl"] = s3_url
                except Exception as ce:
                    print(f"Error uploading child image for post {child.get('id')}: {ce}")
                    child["uploadedImageUrl"] = None
            else:
                child["uploadedImageUrl"] = None

###############################
# 3) FastAPI + Apify Scraping
###############################
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.mount("/static", StaticFiles(directory="static"), name="static")

load_dotenv()

APIFY_TOKEN = os.getenv("APIFY_TOKEN", "your-apify-token-here")
client = ApifyClient(APIFY_TOKEN)

def run_instagram_scraper_sync(instagram_url: str, results_limit: int = 18) -> dict:
    run_input = {
        "directUrls": [instagram_url],
        "resultsType": "posts",
        "resultsLimit": results_limit,
        "scrapeComments": False,
    }
    run = client.actor("apify/instagram-scraper").call(run_input=run_input)
    return run

def get_dataset_items(dataset_id: str) -> list:
    dataset = client.dataset(dataset_id)
    items_response = dataset.list_items(limit=10000)
    return items_response.items

async def scrape_and_upload_images(instagram_url: str, results_limit: int = 18) -> str:
    # 1) Run Apify
    run_data = await asyncio.to_thread(run_instagram_scraper_sync, instagram_url, results_limit)
    dataset_id = run_data.get("defaultDatasetId")
    if not dataset_id:
        raise HTTPException(status_code=500, detail="No dataset ID returned from Apify run")

    # 2) Fetch items, unify sidecars
    items = await asyncio.to_thread(get_dataset_items, dataset_id)
    merged_posts = unify_sidecars(items)

    # 3) Upload images to S3
    bucket_name = os.getenv("AWS_S3_BUCKET_NAME")
    if not bucket_name:
        raise HTTPException(status_code=500, detail="AWS_S3_BUCKET_NAME not set in environment")

    for post in merged_posts:
        process_images_for_post(post, bucket_name)

    # 4) Write final JSON to /static
    os.makedirs("static", exist_ok=True)
    filename = f"scraped_data_{datetime.now().strftime('%Y%m%d%H%M%S')}.json"
    filepath = os.path.join("static", filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(merged_posts, f, indent=2)

    return filename

###############################
# 4) API Endpoints
###############################
@app.post("/scrape", response_class=PlainTextResponse)
async def scrape_endpoint(instagram_url: str = Form(...)):
    """
    1) Scrapes the provided Instagram URL via Apify,
    2) Uploads the raw images to AWS S3,
    3) Writes a JSON file in /static,
    4) Returns the path to the JSON file.
    """
    try:
        result_file = await scrape_and_upload_images(instagram_url)
        return f"/static/{result_file}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# (Optional) If you want a direct GET endpoint to serve the JSON data:
@app.get("/data/{filename}", response_class=JSONResponse)
async def get_data(filename: str):
    filepath = os.path.join("static", filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data

# Add a new endpoint to serve static JSON files with proper content type
@app.get("/static/{filename}", response_class=JSONResponse)
async def get_static_json(filename: str):
    if not filename.endswith('.json'):
        raise HTTPException(status_code=400, detail="Only JSON files are supported by this endpoint")
    
    filepath = os.path.join("static", filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
