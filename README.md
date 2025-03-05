# launch_ig
For insta api

# Cart Design Sorcery

A web application that allows users to create an e-commerce shop from their Instagram posts.

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

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd cart-design-sorcery
npm install
npm run dev
```

Visit `http://localhost:3000` to access the application.
