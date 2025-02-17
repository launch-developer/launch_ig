# generate_cms.py
import os
import json
from jinja2 import Environment, FileSystemLoader, select_autoescape
import webbrowser
from upload_utils import upload_image_to_gcs  # from your upload_utils.py

def generate_cms_page(json_file: str, output_html: str, bucket_name: str):
    # Load scraped JSON data
    with open(json_file, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    
    # For each post, upload the image to GCS and update the post with the new URL.
    for post in posts:
        image_url = None
        if 'images' in post and post['images']:
            image_url = post['images'][0]
        elif 'displayUrl' in post and post['displayUrl']:
            image_url = post['displayUrl']
        
        if image_url:
            # Use the post id to form a unique file name
            destination_blob = f"images/{post.get('id', 'unknown')}.jpg"
            try:
                public_url = upload_image_to_gcs(image_url, bucket_name, destination_blob)
                post['proxy_image'] = public_url
            except Exception as e:
                print(f"Error uploading image for post {post.get('id')}: {e}")
                # Fallback to the original image URL if upload fails.
                post['proxy_image'] = image_url
        else:
            post['proxy_image'] = None

    # Set up the Jinja2 environment (expects your templates folder to contain cms_template.html)
    env = Environment(
        loader=FileSystemLoader(searchpath="templates"),
        autoescape=select_autoescape(["html", "xml"])
    )
    
    # Load your CMS template (make sure cms_template.html uses {{ post.proxy_image }} as the src)
    template = env.get_template("cms_template.html")
    
    # Render the template using the posts data
    rendered_html = template.render(posts=posts)
    
    # Write the rendered HTML to the output file
    with open(output_html, "w", encoding="utf-8") as f:
        f.write(rendered_html)
    
    print("CMS HTML page generated successfully:", output_html)
    # Optionally open the page in your default browser:
    webbrowser.open("file://" + os.path.realpath(output_html))

if __name__ == "__main__":
    # For testing – update the JSON filename and bucket name accordingly.
    generate_cms_page("static/scraped_data_example.json", "static/cms_output.html", "your-unique-bucket-name")
