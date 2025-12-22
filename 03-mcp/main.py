from fastmcp import FastMCP

mcp = FastMCP("Demo 🚀")

@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

@mcp.tool
def scrape_web_page(url: str) -> str:
    """Scrape the content of a web page using Jina reader."""
    jina_url = f"https://r.jina.ai/{url}"
    response = requests.get(jina_url)
    return response.text

if __name__ == "__main__":
    mcp.run()
