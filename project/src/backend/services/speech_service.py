"""
Speech practice service using text comparison and Gemma-3-27b for grading.
Uses browser's Web Speech API for transcription (handled in frontend).
"""
import os
import json
from google import genai


def get_client():
    """Get Gemini client with API key from environment."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable not set")
    return genai.Client(api_key=api_key)


def simple_text_comparison(spoken_text: str, target_text: str) -> dict:
    """
    Simple text comparison for quick scoring without LLM.
    Used as fallback if LLM is unavailable.
    """
    spoken_lower = spoken_text.lower().strip()
    target_lower = target_text.lower().strip()
    
    if spoken_lower == target_lower:
        return {
            "transcription": spoken_text,
            "score": 100,
            "issues": [],
            "feedback": "Perfect! Your pronunciation was excellent! 🎉",
            "correct": True
        }
    elif target_lower in spoken_lower or spoken_lower in target_lower:
        return {
            "transcription": spoken_text,
            "score": 70,
            "issues": ["Partial match - some variation detected"],
            "feedback": f"Good try! The target was '{target_text}'. You were close!",
            "correct": False
        }
    else:
        return {
            "transcription": spoken_text,
            "score": 30,
            "issues": ["Words don't match"],
            "feedback": f"Keep practicing! The target was '{target_text}'. Try saying it again.",
            "correct": False
        }


async def grade_pronunciation_text(spoken_text: str, target_text: str) -> dict:
    """
    Grade pronunciation by comparing transcribed text against target.
    Uses Gemma-3-27b for intelligent feedback.
    
    Args:
        spoken_text: What the browser's speech recognition heard
        target_text: The Finnish word/phrase the user was trying to say
    
    Returns:
        dict with transcription, score, issues, and feedback
    """
    # If no spoken text, return early
    if not spoken_text or not spoken_text.strip():
        return {
            "transcription": "[no speech detected]",
            "score": 0,
            "issues": ["No speech was detected"],
            "feedback": "Please try speaking again. Make sure your microphone is working.",
            "correct": False
        }
    
    try:
        client = get_client()
        
        # Create prompt for grading
        prompt = f"""You are a Finnish language pronunciation coach. A student tried to say a Finnish word.

Target word: "{target_text}"
What was heard: "{spoken_text}"

Evaluate how well they pronounced the word. Consider:
1. Exact match = 100 points
2. Close match with minor differences = 70-90 points  
3. Recognizable but with issues = 40-70 points
4. Very different = 0-40 points

Respond in valid JSON format only (no markdown, no extra text):
{{
    "score": <number 0-100>,
    "issues": ["list of specific issues, if any"],
    "feedback": "encouraging, specific feedback (1-2 sentences)",
    "correct": <true if score >= 70, false otherwise>
}}

Be encouraging! This is a beginner learning Finnish."""

        response = client.models.generate_content(
            model="gemma-3-27b-it",  # Using Gemma-3-27b as specified in agents.md
            contents=prompt
        )
        
        # Parse the JSON response
        response_text = response.text.strip()
        
        # Clean up response if it has markdown code blocks
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            # Find the actual JSON content
            json_lines = []
            in_json = False
            for line in lines:
                if line.startswith("```") and not in_json:
                    in_json = True
                    continue
                elif line.startswith("```") and in_json:
                    break
                elif in_json:
                    json_lines.append(line)
            response_text = "\n".join(json_lines)
        
        result = json.loads(response_text)
        result["transcription"] = spoken_text
        return result
        
    except json.JSONDecodeError as e:
        # Fallback to simple comparison if LLM response can't be parsed
        print(f"JSON parse error: {e}")
        return simple_text_comparison(spoken_text, target_text)
    except Exception as e:
        error_msg = str(e)
        print(f"LLM error: {error_msg}")
        # Fallback to simple comparison
        return simple_text_comparison(spoken_text, target_text)
