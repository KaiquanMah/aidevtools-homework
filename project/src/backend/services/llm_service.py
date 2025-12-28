"""
LLM service for generating content using Google Gemini.
Updated to use the new google-genai SDK.
"""
import os
from google import genai
from google.genai.types import GenerateContentConfig


def get_client():
    """Get Gemini client with API key from environment."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return None
    return genai.Client(api_key=api_key)


async def generate_text(prompt: str) -> str:
    """
    Generate text using Gemini model.
    
    Args:
        prompt: The text prompt to send to the model
    
    Returns:
        Generated text response
    """
    client = get_client()
    if not client:
        return "LLM integration not configured (Missing API Key)."
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"LLM Error: {e}")
        return "Sorry, I couldn't generate a response at this time."


# Placeholder for Audio generation if we want to add it later
# Gemini 2.5 flash native audio is a newer feature, ensuring basic compat first.
