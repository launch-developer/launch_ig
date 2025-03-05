# Cart Design Sorcery

A web application that allows users to create an e-commerce shop from their Instagram posts.

## Project Structure

- `/backend`: FastAPI service for Instagram scraping and image processing
- `/cart-design-sorcery`: React application for displaying the shop
- `/Front-Page-Repo`: Additional frontend components

## Environment Setup

This project requires several environment variables to function properly. For security reasons, these are not included in the repository.

### Setting up environment variables

1. Copy the template files to create your own environment files:
   ```bash
   cp .env.template .env
   cp backend/.env.template backend/.env
   ```

2. Edit the `.env` and `backend/.env` files with your own values:

   - **Instagram API Credentials**: 
     - Create an app in the [Facebook Developer Console](https://developers.facebook.com/)
     - Set `INSTAGRAM_CLIENT_ID` and `INSTAGRAM_CLIENT_SECRET` with your app credentials
     - Configure `INSTAGRAM_REDIRECT_URI` to match your redirect URI in the Facebook Developer Console

   - **Apify Token**:
     - Create an account on [Apify](https://apify.com/)
     - Get your API token and set it as `APIFY_TOKEN`

   - **AWS Credentials**:
     - Create an AWS account and set up an IAM user with S3 access
     - Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` with your IAM user credentials
     - Configure `AWS_REGION` and `AWS_S3_BUCKET_NAME` for your S3 bucket

   - **Secret Key**:
     - Generate a random string for `SECRET_KEY` used for session encryption
     - You can generate one with: `openssl rand -hex 32`

## Security Notes

- **NEVER commit .env files to the repository**
- The repository includes a pre-commit hook to prevent accidentally committing sensitive information
- If you need to share environment configurations with team members, use secure channels

## Running the Application

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd cart-design-sorcery
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## Usage Flow

1. Open the frontend application (typically at http://localhost:3000)
2. Enter an Instagram URL in the form on the landing page
3. After scraping, you'll see a minimalist shop landing page with featured products
4. Click the "Shop" button to view all products

## Technical Details

- The backend uses Apify's Instagram scraper to fetch posts
- Images are processed and uploaded to AWS S3
- The frontend displays the scraped posts as products in a shop layout
