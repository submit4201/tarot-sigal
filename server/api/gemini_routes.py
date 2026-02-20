from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import os
from google import genai

from api.deps import get_current_user
from models.database_models import User
from core.logger import app_logger

router = APIRouter()

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = None

if GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        app_logger.error(f"Failed to initialize Gemini Client: {e}")

class GeminiRequest(BaseModel):
    prompt: str
    model: str = "gemini-2.5-flash"

@router.post("/generate")
def generate_content(request: GeminiRequest, current_user: User = Depends(get_current_user)):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API is not configured on the server.")
        
    try:
        app_logger.info(f"Generating Gemini content for user: {current_user.id} with model: {request.model}")
        response = client.models.generate_content(
            model=request.model,
            contents=request.prompt
        )
        return {"success": True, "text": response.text, "model": request.model}
    except Exception as e:
        app_logger.error(f"Gemini API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
