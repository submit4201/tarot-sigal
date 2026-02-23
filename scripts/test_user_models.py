import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("OPENROUTER_API", "").strip()
url = "https://openrouter.ai/api/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
}

models = [
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "arcee-ai/trinity-large-preview:free",
    "stepfun/step-3.5-flash:free",
    "arcee-ai/trinity-large-preview:free"
]

for model in models:
    print(f"\nTesting model: {model}")
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "Return code 200"}],
        "temperature": 0.5
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"SUCCESS: {response.json()['choices'][0]['message']['content']}")
        else:
            print(f"Detail: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
