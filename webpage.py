import json
import re
import os

# File paths
json_file_path = "output.json"
html_file = "index.html"
print("Waffle Fries")

# Load JSON data
with open(json_file_path, "r", encoding="utf-8") as file:
    data = json.load(file)

# Extract Instagram image URLs (limit to first 8)
image_urls = []
for post in data:
    if "displayUrl" in post:
        image_urls.append(post["displayUrl"])
    if "images" in post:
        image_urls.extend(post["images"])
        # Limit to first 8 images

print(image_urls)
image_urls = image_urls[:8]

# Function to replace image elements with textboxes containing image URLs
def replace_images_with_textboxes(html_path, new_urls):
    with open(html_path, "r", encoding="utf-8") as file:
        html_content = file.read()

    # Find all image elements
    img_tags = re.findall(r'(<img\s+[^>]*src=["\'])([^"\']+)(["\'][^>]*>)', html_content)

    # Replace only the first 8 image elements with textboxes
    updated_html = html_content
    count = 0
    for match in img_tags:
        start, old_url, end = match
        if count < len(new_urls):  # Ensure we don't run out of new URLs
            new_textbox = f'<input type="text" value="{new_urls[count]}" readonly style="width:100%;">'
            updated_html = updated_html.replace(start + old_url + end, new_textbox, 1)
            count += 1
            print(count)
        else:
            break

    # Save the updated HTML file
    with open(html_path, "w", encoding="utf-8") as file:
        file.write(updated_html)

# Apply the replacements
replace_images_with_textboxes(html_file, image_urls)

print("First 8 image elements in index.html replaced with textboxes containing Instagram image URLs.")
