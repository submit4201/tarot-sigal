from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import os
import requests

from api.deps import get_current_user

from models.database_models import User
from core.logger import app_logger

router = APIRouter()

# API Keys
OPENROUTER_API = os.getenv("OPENROUTER_API", "").strip()

class GeminiRequest(BaseModel):
    prompt: str
    model: str = "arcee-ai/trinity-large-preview:free"

@router.post("/generate")
def generate_content(request: GeminiRequest, current_user: User = Depends(get_current_user)):
    # Re-fetch at runtime to ensure dotenv has loaded
    api_key = os.getenv("OPENROUTER_API", "").strip()
    
    if not api_key:
        app_logger.error("OpenRouter API key is missing in environment.")
        raise HTTPException(status_code=500, detail="OpenRouter API is not configured on the server. Check .env.local")
        
    # Sanitized log for debugging
    sanitized_key = f"{api_key[:6]}...{api_key[-4:]}" if len(api_key) > 10 else "REDACTED"
    url = "https://openrouter.ai/api/v1/chat/completions"
    app_logger.info(f"OpenRouter Request: {url} | Model: {request.model} | Key: {sanitized_key}")
        
    try:
        app_logger.info(f"Generating OpenRouter content for user: {current_user.id} with model: {request.model}")
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": request.model,
            "messages": [
                {"role": "user", "content": request.prompt}
            ],
            "temperature": 0.7
        }
        
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        response.raise_for_status()
        data = response.json()
        
        generated_text = data["choices"][0]["message"]["content"]
        
        return {"success": True, "text": generated_text, "model": request.model}
    except requests.exceptions.HTTPError as e:
        error_body = e.response.text
        app_logger.error(f"OpenRouter API HTTP error: {e} | Body: {error_body}")
        raise HTTPException(status_code=500, detail=f"OpenRouter Error: {error_body}")
    except Exception as e:
        app_logger.error(f"OpenRouter API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":

    generate_content("Hello, how are you?")