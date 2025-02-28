import os
import json
import requests
import shutil
from bs4 import BeautifulSoup
from upload_utils import upload_directory_to_s3

def find_template_directories():
    """
    Finds all HTML5UP template directories (starting with "html5up-") in the working directory.
    Returns a list of matching directory paths.
    """
    return [d for d in os.listdir() if os.path.isdir(d) and d.startswith("html5up-")]

def download_image(image_url, save_path):
    """
    Downloads an image from a given URL and saves it locally.
    """
    try:
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            with open(save_path, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            return save_path
    except Exception as e:
        print(f"Error downloading image {image_url}: {e}")
    return None

def replace_images_in_directory(template_dir, posts):
    """
    Replaces images in the 'images' folder of the given HTML5UP template with new scraped images.
    """
    images_dir = os.path.join(template_dir, "images")
    
    if not os.path.exists(images_dir):
        print(f"Error: No 'images' directory found in {template_dir}")
        return []

    # Remove old images and prepare new directory
    shutil.rmtree(images_dir)
    os.makedirs(images_dir, exist_ok=True)

    new_image_paths = []
    for idx, post in enumerate(posts):
        if "displayUrl" in post:
            new_image_path = os.path.join(images_dir, f"image_{idx}.jpg")
            if download_image(post["displayUrl"], new_image_path):
                new_image_paths.append(f"images/image_{idx}.jpg")

    return new_image_paths

def update_html_files(template_dir, new_images):
    """
    Updates all `.html` files in the template directory to reference new images.
    """
    html_files = [f for f in os.listdir(template_dir) if f.endswith(".html")]
    image_iter = iter(new_images)

    for html_file in html_files:
        html_path = os.path.join(template_dir, html_file)
        
        with open(html_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")

        img_tags = soup.find_all("img")

        for img in img_tags:
            if img.get("src") and "images/" in img["src"]:
                try:
                    img["src"] = next(image_iter)
                except StopIteration:
                    break  # Stop replacing if we run out of images

        with open(html_path, "w", encoding="utf-8") as f:
            f.write(str(soup))

def generate_cms_pages(json_file: str, bucket_name: str):
    """
    Processes all HTML5UP template directories: replaces images, updates HTML files, 
    and uploads the modified directories to AWS S3.
    """
    template_dirs = find_template_directories()
    
    if not template_dirs:
        raise Exception("No HTML5UP template directories found.")

    with open(json_file, 'r', encoding='utf-8') as f:
        all_posts = json.load(f)

    for template_dir in template_dirs:
        print(f"Processing template: {template_dir}")

        # Replace images in the template
        new_images = replace_images_in_directory(template_dir, all_posts)

        # Update all HTML files to use new images
        update_html_files(template_dir, new_images)

        # Upload the entire modified template directory
        upload_directory_to_s3(template_dir, bucket_name, template_dir)

        print(f"Modified template directory '{template_dir}' uploaded successfully.")
