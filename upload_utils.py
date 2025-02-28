import os
import requests
import boto3
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def upload_file_to_s3(file_path: str, bucket_name: str, destination_key: str) -> str:
    """
    Uploads a file to AWS S3 and returns its public URL.
    """
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_S3_REGION"),
    )

    with open(file_path, "rb") as file_data:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=destination_key,
            Body=file_data,
            ContentType="image/jpeg" if file_path.endswith(".jpg") else "text/html",
            ACL="public-read"
        )

    public_url = f"https://{bucket_name}.s3.{os.getenv('AWS_S3_REGION')}.amazonaws.com/{destination_key}"
    return public_url

def upload_directory_to_s3(directory_path: str, bucket_name: str, s3_prefix: str):
    """
    Uploads all files in a directory to S3.
    """
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_S3_REGION"),
    )

    for root, _, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            s3_key = f"{s3_prefix}/{file}"
            
            with open(file_path, "rb") as data:
                s3_client.put_object(
                    Bucket=bucket_name,
                    Key=s3_key,
                    Body=data,
                    ContentType="image/jpeg",
                    ACL="public-read"
                )
            print(f"Uploaded {file_path} to S3 as {s3_key}")
