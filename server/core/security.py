from datetime import datetime, timedelta
from pwdlib import PasswordHash
from jose import JWTError, jwt
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from a path resolved relative to this file
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env.local"
load_dotenv(dotenv_path=env_path)

# Security configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    # In development, you might want to load from .env.local, but for production,
    # this MUST be provided by the environment.
    raise RuntimeError("JWT_SECRET_KEY environment variable is not set")
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
