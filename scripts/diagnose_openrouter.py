import os
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load env from .env.local
env_path = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("OPENROUTER_API", "").strip()
print(f"Testing with key: {api_key[:6]}...{api_key[-4:]}")

url = "https://openrouter.ai/api/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://gridpunk-arcana.vercel.app",
    "X-Title": "Gridpunk Arcana"
}

payload = {
    "model": "arcee-ai/trinity-large-preview:free",
    "messages": [
        {"role": "user", "content": "Return the word 'ONLINE'"}
    ],
    "temperature": 0.7
}

print(f"Sending request to {url}...")
try:
    response = requests.post(url, headers=headers, json=payload, timeout=20)
    print(f"Status Code: {response.status_code}")
    print("Response Headers:")
    for k, v in response.headers.items():
        print(f"  {k}: {v}")
    print("-" * 20)
    print("Response Body:")
    print(response.text)
    print("-" * 20)
except Exception as e:
    print(f"Request failed: {e}")
