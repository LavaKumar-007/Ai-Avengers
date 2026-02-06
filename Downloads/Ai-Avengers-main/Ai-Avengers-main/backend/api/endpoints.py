from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.ai_service import (
    generate_brand_content,
    generate_brand_chat,
    generate_pdf_kit,
    generate_logo_image
)

router = APIRouter()

# =========================
# Data Models
# =========================

class BrandRequest(BaseModel):
    description: str
    industry: str
    audience: str
    tone: List[str]
    name: Optional[str] = None

class BrandResponse(BaseModel):
    names: List[str]
    tagline: str
    description: str
    logos: List[str]
    palette: List[str]
    bio: str
    founder_story: str
    scores: dict

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

class ChatResponse(BaseModel):
    response: str

# Logo request model matching your ai_service function
class LogoRequest(BaseModel):
    name: str
    industry: str
    tone: str

# =========================
# Endpoints
# =========================

@router.post("/generate-brand", response_model=BrandResponse)
async def generate_brand(request: BrandRequest):
    try:
        brand_data = await generate_brand_content(request)
        return brand_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat", response_model=ChatResponse)
async def chat_with_brand_assistant(request: ChatRequest):
    try:
        response = await generate_brand_chat(request.message, request.history)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/export-pdf")
async def export_brand_kit():
    return {"status": "Not implemented yet"}


# ⭐ REAL LOGO GENERATION ENDPOINT (matches your service)
@router.post("/generate-logo")
async def generate_logo(request: LogoRequest):
    try:
        logo = generate_logo_image(request.name, request.industry, request.tone)
        if not logo:
            raise Exception("Logo generation failed. Check STABILITY_API_KEY.")
        return {"logo": logo}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))