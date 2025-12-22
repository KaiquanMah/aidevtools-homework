from fastmcp import FastMCP
import requests

mcp = FastMCP("Demo 🚀")

#######################
# q1, q2
#######################
@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b
#######################

#######################
# q3
#######################
# exposed method
@mcp.tool
def scrape_web_page(url: str) -> str:
    """Scrape the content of a web page using Jina reader."""
    return _scrape_web_page(url)

# backend method - with a '_' prefix to indicate the method is not exposed to the user
def _scrape_web_page(url: str) -> str:
    # Prepend https://r.jina.ai/ to the URL to get markdown content
    jina_url = f"https://r.jina.ai/{url}"
    response = requests.get(jina_url)
    return response.text
#######################


if __name__ == "__main__":
    mcp.run()
