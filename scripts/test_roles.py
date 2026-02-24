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

# Test 1: Only User
print("Test 1: User-only messages...")
p1 = {
    "model": "arcee-ai/trinity-large-preview:free",
    "messages": [{"role": "user", "content": "Hi"}],
}
r1 = requests.post(url, headers=headers, json=p1)
print(f"Status: {r1.status_code}")

# Test 2: System + User
print("\nTest 2: System + User messages...")
p2 = {
    "model": "arcee-ai/trinity-large-preview:free",
    "messages": [
        {"role": "system", "content": "Act as a bot."},
        {"role": "user", "content": "Hi"}
    ],
}
r2 = requests.post(url, headers=headers, json=p2)
print(f"Status: {r2.status_code}")
# Test 4: Full System Prompt merged into User Role
print("\nTest 4: Full System Prompt merged into User Role...")
system_content = """You are a MASTER SYNTHESIST... [TRUNCATED FOR TEST]"""
p4 = {
    "model": "arcee-ai/trinity-large-preview:free",
    "messages": [
        {"role": "user", "content": system_content + "\n\nHi"}
    ],
}
r4 = requests.post(url, headers=headers, json=p4)
print(f"Status: {r4.status_code}")
# Test 5: Fallback Model Test (Gemini 1.5 Flash Free)
print("\nTest 5: Fallback Model Test (Gemini 1.5 Flash Free)...")
p5 = {
    "model": "google/gemini-flash-1.5:free",
    "messages": [
        {"role": "user", "content": system_content + "\n\nHi"}
    ],
}
r5 = requests.post(url, headers=headers, json=p5)
print(f"Status: {r5.status_code}")
# Test 6: Mistral 7B Free
print("\nTest 6: Mistral 7B Free...")
p6 = {
    "model": "mistralai/mistral-7b-instruct:free",
    "messages": [
        {"role": "user", "content": "Return the word 'MISTRAL'"}
    ],
}
r6 = requests.post(url, headers=headers, json=p6)
print(f"Status: {r6.status_code}")
if r6.status_code == 200:
    print("!! SUCCESS with Mistral 7B Free !!")
