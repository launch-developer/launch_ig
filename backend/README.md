# Instagram Shop Backend

This backend service provides:

1. Instagram post scraping functionality
2. Image processing and S3 storage
3. API endpoints for the frontend to interact with

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables in a `.env` file:
```
APIFY_API_TOKEN=your_apify_token
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=your_s3_bucket_name
```

3. Start the server:
```bash
python main.py
```

## API Endpoints

- `POST /scrape`: Scrapes Instagram posts from a provided URL
  - Request body: Form data with `instagram_url` field
  - Response: JSON with scraped post data

- `GET /static/{file_path}`: Serves static files

## Implementation Details

- Uses FastAPI for the web framework
- Integrates with Apify's `zuzka/instagram-post-scraper` for Instagram scraping
- Processes and uploads images to AWS S3
- Handles sidecar posts (multiple images in a single post)
- Provides CORS support for frontend integration

## Notes

- The server runs on port 8000 by default
- Scraped data is processed to fit the frontend's product display format
- Images are uploaded to S3 for reliable storage and delivery 