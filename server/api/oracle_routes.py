"""
oracle_routes.py — LM Studio Oracle Proxy
==========================================
Forwards AI generation requests to LM Studio's local OpenAI-compatible
REST API (http://localhost:1234/v1). Falls back gracefully so the
frontend can detect unavailability and cascade to Puter/OpenRouter.

@note LM Studio must be running with a model loaded for this to succeed.
@note Uses plain `requests` — no SDK needed for text-only inference.
"""

import os
import requests as http_requests
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from core.logger import app_logger

router = APIRouter()

# LM Studio default local endpoint (OpenAI-compatible)
_LMS_BASE = os.environ.get("LMSTUDIO_BASE_URL", "http://localhost:1234/v1")
_LMS_TIMEOUT = int(os.environ.get("LMSTUDIO_TIMEOUT", "90"))


class OracleRequest(BaseModel):
    """Schema for oracle generation requests."""
    prompt: str
    system: Optional[str] = None
    temperature: Optional[float] = 0.8
    max_tokens: Optional[int] = 2048


@router.get("/status")
def oracle_status():
    """
    Health-check: returns whether LM Studio is reachable and what model is loaded.

    @returns { available: bool, model?: str }
    """
    try:
        resp = http_requests.get(
            f"{_LMS_BASE}/models",
            timeout=5,
        )
        if resp.status_code == 200:
            models = resp.json().get("data", [])
            loaded = models[0]["id"] if models else "unknown"
            return {"available": True, "model": loaded}
    except Exception:
        pass
    return {"available": False, "model": None}


@router.post("/generate")
def oracle_generate(request: OracleRequest):
    """
    Generate text via LM Studio's local OpenAI-compatible chat endpoint.

    Sends a simple user (+ optional system) message and returns the
    assistant's text response. If LM Studio is offline or returns an
    error, returns { available: False } so the frontend can fall back.

    @param request  OracleRequest with prompt, optional system, temperature, max_tokens
    @returns { success: bool, text?: str, model?: str, source: str, available?: bool }
    """
    messages = []

    if request.system:
        messages.append({"role": "system", "content": request.system})

    messages.append({"role": "user", "content": request.prompt})

    payload = {
        "messages": messages,
        "temperature": request.temperature,
        "max_tokens": request.max_tokens,
        # @note Qwen-family models: disable thinking for fast responses
        "extra_body": {"enable_thinking": False},
    }

    try:
        resp = http_requests.post(
            f"{_LMS_BASE}/chat/completions",
            json=payload,
            timeout=_LMS_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()

        text = data["choices"][0]["message"]["content"]
        model_id = data.get("model", "lmstudio-local")

        app_logger.info(f"[Oracle] LM Studio responded via model={model_id}")
        return {
            "success": True,
            "text": text,
            "model": model_id,
            "source": "lmstudio",
        }

    except http_requests.exceptions.ConnectionError:
        app_logger.warning("[Oracle] LM Studio not reachable (connection refused).")
        return {"available": False, "success": False, "source": "lmstudio"}

    except http_requests.exceptions.Timeout:
        app_logger.warning("[Oracle] LM Studio request timed out.")
        return {"available": False, "success": False, "source": "lmstudio"}

    except Exception as e:
        app_logger.error(f"[Oracle] LM Studio error: {e}")
        return {"available": False, "success": False, "source": "lmstudio", "error": str(e)}
