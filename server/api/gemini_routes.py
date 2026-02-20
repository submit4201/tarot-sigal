from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import os
import requests

from api.deps import get_current_user
from models.database_models import User
from core.logger import app_logger

router = APIRouter()

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class GeminiRequest(BaseModel):
    prompt: str
    model: str = "llama-3.3-70b-versatile"

@router.post("/generate")
def generate_content(request: GeminiRequest, current_user: User = Depends(get_current_user)):
    if not GROQ_API_KEY:
        app_logger.error("Groq API key is missing.")
        raise HTTPException(status_code=500, detail="Groq API is not configured on the server.")
        
    try:
        app_logger.info(f"Generating Groq content for user: {current_user.id} with model: {request.model}")
        
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
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
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        response.raise_for_status()
        data = response.json()
        
        generated_text = data["choices"][0]["message"]["content"]
        
        return {"success": True, "text": generated_text, "model": request.model}
    except Exception as e:
        app_logger.error(f"Groq API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
