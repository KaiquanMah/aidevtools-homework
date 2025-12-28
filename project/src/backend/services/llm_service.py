import os
import google.generativeai as genai
from fastapi import HTTPException

# Configure Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

async def generate_text(prompt: str):
    if not GOOGLE_API_KEY:
        return "LLM integration not configured (Missing API Key)."
    
    try:
        model = genai.GenerativeModel('gemini-pro') # Using std gemini-pro for text
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"LLM Error: {e}")
        return "Sorry, I couldn't generate a response at this time."

# Place holder for Audio generation if we want to add it later
# Gemini 2.5 flash native audio is a newer feature, ensuring basic compat first.
