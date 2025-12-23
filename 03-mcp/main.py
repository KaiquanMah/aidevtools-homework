from fastmcp import FastMCP
import requests
from search import setup_search

#######################
# q6
#######################
# Initialize search index
# Note: In a real production app, you might want to do this lazily or async,
# but for this homework, initializing at startup is fine.
index = setup_search()
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

def _search(query: str, num_results: int = 5, repo_url: str = None) -> str:
    # If repo_url is provided, create a new index for that repo
    # Otherwise, use the global index
    if repo_url:
        search_index = setup_search(url=repo_url)
    else:
        search_index = index
    
    results = search_index.search(
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
