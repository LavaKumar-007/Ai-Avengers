import os
import google.generativeai as genai
from dotenv import load_dotenv
import pathlib

# Explicitly load .env from the backend directory
env_path = pathlib.Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("AI Service: GEMINI_API_KEY loaded successfully.")
else:
    print(f"AI Service: GEMINI_API_KEY NOT found. Env path checked: {env_path}")

import requests
import base64

STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")
if STABILITY_API_KEY:
    print("AI Service: STABILITY_API_KEY loaded successfully.")
else:
    print("AI Service: STABILITY_API_KEY NOT found.")

def generate_logo_image(name, industry, tone):
    if not STABILITY_API_KEY:
        return None
        
    url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
    
    prompt = f"minimalist vector logo design for {name}, {industry} company, {tone} style, white background, high quality, professional"
    
    body = {
        "steps": 30,
        "width": 1024,
        "height": 1024,
        "seed": 0,
        "cfg_scale": 7,
        "samples": 1,
        "text_prompts": [
            {
            "text": prompt,
            "weight": 1
            }
        ],
    }
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {STABILITY_API_KEY}",
    }
    
    try:
        response = requests.post(url, headers=headers, json=body, timeout=15)
        if response.status_code != 200:
            print(f"Stability API Error: {response.text}")
            return None
            
        data = response.json()
        image_base64 = data["artifacts"][0]["base64"]
        return f"data:image/png;base64,{image_base64}"
    except Exception as e:
        print(f"Logo generation failed: {e}")
        return None

async def generate_brand_content(request):
    """
    Generates brand content using Gemini API.
    """
    if not GEMINI_API_KEY:
        # Return mock data if no key
        return get_mock_brand_data()

    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    Act as a professional branding expert. Create a complete brand identity for a startup with the following details:
    Description: {request.description}
    Industry: {request.industry}
    Target Audience: {request.audience}
    Tone: {', '.join(request.tone)}
    
    Return a valid JSON object with the following keys and ONLY the JSON:
    {{
        "names": ["name1", "name2", "name3", "name4", "name5"],
        "tagline": "A catchy tagline",
        "description": "A compelling brand description (2-3 sentences)",
        "palette": ["#Hex1", "#Hex2", "#Hex3", "#Hex4", "#Hex5"],
        "bio": "A social media bio (Instagram/LinkedIn)",
        "founder_story": "A short, inspiring founder story based on the description.",
        "scores": {{
            "memorability": 8.5,
            "tone_match": 0.9,
            "market_uniqueness": 0.8,
            "audience_appeal": 0.9
        }}
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        # Simple cleaning of code blocks if present
        text = response.text.replace("```json", "").replace("```", "").strip()
        import json
        data = json.loads(text)
        
        # Generate Logosa
        logos = []
        # Try to generate one real logo if key exists
        real_logo = generate_logo_image(data['names'][0], request.industry, request.tone[0] if request.tone else "modern")
        if real_logo:
             logos.append(real_logo)
             # Add Placeholders for others to save credits/time
             logos.extend([
                f"https://placehold.co/150?text={data['names'][1]}",
                f"https://placehold.co/150?text={data['names'][2]}",
                f"https://placehold.co/150?text={data['names'][3]}"
             ])
        else:
             # Fallback all
             logos = [
                f"https://placehold.co/150?text={data['names'][0]}",
                f"https://placehold.co/150?text={data['names'][1]}",
                f"https://placehold.co/150?text={data['names'][2]}",
                f"https://placehold.co/150?text={data['names'][3]}"
            ]
            
        data['logos'] = logos
        return data
    except Exception as e:
        print(f"Error generating brand: {e}")
        return get_mock_brand_data()

async def generate_brand_chat(message, history):
    if not GEMINI_API_KEY:
        return "I am a mock AI assistant. Please provide an API key to chat with me properly."
    
    model = genai.GenerativeModel('gemini-pro')
    # Use history if needed, for now just simple chat
    response = model.generate_content(f"You are a branding assistant. User asks: {message}")
    return response.text

async def generate_pdf_kit():
    pass

def get_mock_brand_data():
    return {
        "names": ["BrandFlow", "SparkWorks", "NexGen", "VantagePoint", "Elevate"],
        "tagline": "Elevating your future.",
        "description": "A startup focused on delivering excellence in the industry.",
        "logos": ["https://placehold.co/150?text=BrandFlow"],
        "palette": ["#1E3A8A", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"],
        "bio": "Building the future, one step at a time. #Startup #Innovation",
        "founder_story": "Founded in a garage, we aim to change the world.",
        "scores": {
            "memorability": 8,
            "tone_match": 85,
            "market_uniqueness": 76,
            "audience_appeal": 90
        }
    }
