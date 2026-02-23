import os
import boto3
from botocore.exceptions import NoCredentialsError
from dotenv import load_dotenv

# Load environment variables
script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(script_dir, '..', '.env')
load_dotenv(env_path)

# Configuration
SPACES_ACCESS_KEY = os.getenv('SPACES_ACCESS_KEY_ID')
SPACES_SECRET_KEY = os.getenv('SPACES_SECRET_KEY')
SPACE_NAME = 'tarot'
REGION = 'sfo3'
LOCAL_DIRECTORY = './public/assets/cards/tarot'

def upload_to_spaces():
    if not SPACES_ACCESS_KEY or not SPACES_SECRET_KEY:
        print("Error: SPACES_ACCESS_KEY_ID or SPACES_SECRET_KEY not found in .env")
        return

    # Initialize session
    session = boto3.session.Session()
    client = session.client('s3',
                            region_name=REGION,
                            endpoint_url=f'https://{REGION}.digitaloceanspaces.com',
                            aws_access_key_id=SPACES_ACCESS_KEY,
                            aws_secret_access_key=SPACES_SECRET_KEY)

    print(f"Starting upload to DigitalOcean Space: {SPACE_NAME}")

    for root, dirs, files in os.walk(LOCAL_DIRECTORY):
        for file in files:
            local_path = os.path.join(root, file)
            
            # Construct S3 path (remove the local directory prefix and handle Windows slashes)
            relative_path = os.path.relpath(local_path, LOCAL_DIRECTORY)
            s3_path = relative_path.replace("\\", "/")

            try:
                print(f"Uploading {s3_path}...", end='\r')
                client.upload_file(local_path, SPACE_NAME, s3_path, ExtraArgs={'ACL': 'public-read'})
            except NoCredentialsError:
                print("\nCredentials not available")
                return
            except Exception as e:
                print(f"\nFailed to upload {s3_path}: {e}")

    print("\nSync complete! All assets are now live.")

if __name__ == "__main__":
    upload_to_spaces()
