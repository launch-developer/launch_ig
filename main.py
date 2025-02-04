import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.middleware.sessions import SessionMiddleware
from starlette.config import Config

# Load configs from environment variables (with defaults)
CLIENT_ID = os.environ.get("INSTAGRAM_CLIENT_ID", "your_instagram_client_id")
CLIENT_SECRET = os.environ.get("INSTAGRAM_CLIENT_SECRET", "your_instagram_client_secret")
REDIRECT_URI = os.environ.get("INSTAGRAM_REDIRECT_URI", "http://localhost:8000/auth")
SECRET_KEY = os.environ.get("SECRET_KEY", "your_session_secret_key")

# Initialize FastAPI app and add session middleware
app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# Set up Jinja2 templates (expects a "templates" directory in the project root)
templates = Jinja2Templates(directory="templates")

# Create a config for Authlib from environment variables
config_data = {
    "INSTAGRAM_CLIENT_ID": CLIENT_ID,
    "INSTAGRAM_CLIENT_SECRET": CLIENT_SECRET,
    "INSTAGRAM_REDIRECT_URI": REDIRECT_URI,
    "SECRET_KEY": SECRET_KEY,
}
config = Config(environ=config_data)

# Set up OAuth with Authlib for Instagram
oauth = OAuth(config)
instagram = oauth.register(
    name="instagram",
    client_id=config("INSTAGRAM_CLIENT_ID"),
    client_secret=config("INSTAGRAM_CLIENT_SECRET"),
    access_token_url="https://api.instagram.com/oauth/access_token",
    authorize_url="https://api.instagram.com/oauth/authorize",
    api_base_url="https://graph.instagram.com/",
    client_kwargs={"scope": "user_profile,user_media"},
)

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """
    Home endpoint. Redirects to the dashboard.
    """
    return RedirectResponse(url="/dashboard")

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    """
    Renders the dashboard. If a user is logged in (i.e. account linked), their data is displayed.
    Otherwise, a link is provided to initiate the Instagram OAuth flow.
    """
    user = request.session.get("user")
    return templates.TemplateResponse("first_dashboard.html", {"request": request, "user": user})

@app.get("/login")
async def login(request: Request):
    """
    Initiates the OAuth flow by redirecting the user to Instagram's login page.
    """
    redirect_uri = config("INSTAGRAM_REDIRECT_URI")
    return await instagram.authorize_redirect(request, redirect_uri)

@app.get("/auth")
async def auth(request: Request):
    """
    OAuth callback endpoint. Handles the response from Instagram,
    obtains an access token, fetches basic user information,
    and stores it in the session.
    """
    try:
        token = await instagram.authorize_access_token(request)
    except OAuthError as error:
        raise HTTPException(status_code=400, detail=f"OAuth error: {error}")

    # Use the token to get user information
    user_data_response = await instagram.get("me?fields=id,username")
    user_data = user_data_response.json()

    # Store the user information in the session
    request.session["user"] = user_data
    # Optionally, store the token as well if you plan to make further API calls later:
    request.session["token"] = token

    return RedirectResponse(url="/dashboard")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
