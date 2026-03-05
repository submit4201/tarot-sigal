from datetime import datetime, timedelta
from pwdlib import PasswordHash
from jose import JWTError, jwt
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables. Try .env.local first, then fallback to .env in root.
# BASE_DIR is 'server/', ROOT_DIR is the project root.
BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent

searched_paths = []
for env_file in [".env.local", ".env"]:
    env_path = ROOT_DIR / env_file
    searched_paths.append(str(env_path))
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
        break

# Security configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    # Diagnostic info for the error message
    cwd = os.getcwd()
    env_keys = list(os.environ.keys())
    error_msg = (
        f"JWT_SECRET_KEY environment variable is not set.\n"
        f"  - Current Working Directory: {cwd}\n"
        f"  - Searched .env paths: {searched_paths}\n"
        f"  - Environment keys visible: {env_keys[:10]}... (total {len(env_keys)})\n"
        f"  - TIP: If on Heroku/Cloud, set JWT_SECRET_KEY in your dashboard."
    )
    raise RuntimeError(error_msg)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days for convenience

password_hash = PasswordHash.recommended()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return password_hash.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
