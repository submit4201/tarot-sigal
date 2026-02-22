from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import os
import requests

from api.deps import get_current_user
from models.database_models import User
from core.logger import app_logger

router = APIRouter()

# API Keys
OPENROUTER_API = os.getenv("OPENROUTER_API")
# Fallback to the one the user defined at the bottom if the first one was grabbed wrongly
if not OPENROUTER_API:
   OPENROUTER_API = os.getenv("OPENROUTER_API", "")

class GeminiRequest(BaseModel):
    prompt: str
    model: str = "arcee-ai/trinity-large-preview:free"

@router.post("/generate")
def generate_content(request: GeminiRequest, current_user: User = Depends(get_current_user)):
    if not OPENROUTER_API:
        app_logger.error("OpenRouter API key is missing.")
        raise HTTPException(status_code=500, detail="OpenRouter API is not configured on the server.")
        
    try:
        app_logger.info(f"Generating OpenRouter content for user: {current_user.id} with model: {request.model}")
        
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API}",
            "HTTP-Referer": "http://localhost:5173", # Update in prod
            "X-Title": "Gridpunk Arcana",
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
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        response.raise_for_status()
        data = response.json()
        
        generated_text = data["choices"][0]["message"]["content"]
        
        return {"success": True, "text": generated_text, "model": request.model}
    except Exception as e:
        app_logger.error(f"OpenRouter API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

