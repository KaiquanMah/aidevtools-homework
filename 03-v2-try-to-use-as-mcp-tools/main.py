from fastmcp import FastMCP
import requests
import os
import sys
from search import setup_search

# Ensure FastMCP doesn't print the welcome banner to stdout
os.environ["FASTMCP_NO_BANNER"] = "true"

#######################
# q6
#######################
# Initialize search index lazily
_index = None

def get_index():
    global _index
    if _index is None:
        _index = setup_search()
    return _index
#######################


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

#######################
# q6
#######################
@mcp.tool
def search(query: str) -> str:
    """Search the knowledge base for a query."""
    return _search(query)

def _search(query: str, num_results: int = 5) -> str:
    index = get_index()
    results = index.search(
        query=query,
        boost_dict={"content": 1},
        num_results=num_results
    )

    output = []
    for i, result in enumerate(results):
        output.append(f"## File {i+1}: {result['filename']}\nContent: {result['content']}\n## ================================\n\n")
    
    return "\n".join(output)
#######################


if __name__ == "__main__":
    mcp.run()
