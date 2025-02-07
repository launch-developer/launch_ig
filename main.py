import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import httpx

# Initialize FastAPI app and set up templates
app = FastAPI()
templates = Jinja2Templates(directory="templates")
load_dotenv()

# Apify configuration (set APIFY_TOKEN in your environment)
APIFY_TOKEN = os.environ.get("APIFY_TOKEN", "your_apify_token")
print ("APIFY_TOKEN:", APIFY_TOKEN)
# This endpoint will run the Instagram Scraper actor synchronously
APIFY_SYNC_RUN_URL = f"https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token={APIFY_TOKEN}"

async def run_apify_scraper_sync(instagram_url: str, results_limit: int = 10):
    input_data = {
         "directUrls": [instagram_url],
         "resultsType": "posts",  # Ensure you're passing the type if needed
         "resultsLimit": results_limit,
    }
    # Increase the timeout to 120 seconds (or more if needed)
    async with httpx.AsyncClient(timeout=120.0) as client:
         response = await client.post(APIFY_SYNC_RUN_URL, json=input_data)
         if response.status_code != 200:
              print("Apify error response:", response.text)
              raise HTTPException(status_code=500, detail="Failed to run Apify scraper synchronously")
         dataset_items = response.json()
         return dataset_items

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """
    Render the dashboard page. Initially no scraped data is displayed.
    """
    return templates.TemplateResponse("first_dashboard.html", {"request": request, "scraped_data": None})

@app.post("/scrape", response_class=HTMLResponse)
async def scrape(request: Request, instagram_url: str = Form(...)):
    """
    Receives the Instagram URL from a form, calls Apify to scrape data,
    and then renders the dashboard with the returned data.
    """
    scraped_data = await run_apify_scraper_sync(instagram_url)
    return templates.TemplateResponse("first_dashboard.html", {"request": request, "scraped_data": scraped_data})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
