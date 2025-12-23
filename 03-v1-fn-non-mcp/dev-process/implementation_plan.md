# Implementation Plan - MCP Server Clone

Building a Context7 clone MCP server as per homework requirements.

## User Review Required
> [!NOTE]
> I will be using `uv` for dependency management *inside* a Docker container as requested.

## Proposed Changes

### Environment
- Create `Dockerfile` using a Python base image, installing `uv`.
- Build and run the container.
- Initialize `uv` project inside the container (or map local dir).
- Add dependencies: `fastmcp`, `requests`, `minsearch`.

### Files

#### [NEW] [Dockerfile](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-mcp/Dockerfile)
- Base image: `python:3.12-slim` (or similar).
- Install `uv`.
- Set up working directory.
- Copy files.

#### [MODIFY] [main.py](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-mcp/main.py)
*   Import `setup_search` from `search.py`.
*   Initialize the search index (global variable).
*   Add `search` tool that uses the index to find documents.

#### [MODIFY] [extra-notes.md](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-mcp/extra-notes.md)
*   Add section for Question 6 (Implementation details).

#### [NEW] [main.py](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-mcp/main.py)
- Initial setup with `FastMCP`.
- Will add `add` tool (QA 2).
- Will add `scrape_web_page` tool (QA 3, 4).
- Will add `search` tool (QA 6).

#### [NEW] [test_scrape.py](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-mcp/test_scrape.py)
- Script to test the scraping function and get the character count.

#### [NEW] [search.py](file:///c:/Users/kaiqu/Downloads/aidevtools-homework/03-mcp/search.py)
- Logic to download zip, process files.
- Indexing with `minsearch`.
- Search functionality to answer QA 5.

## Verification Plan

### Automated Tests
- `python test_scrape.py` to verify scraping.
- `python search.py` to verify search results.

### Manual Verification
- Run `uv run python main.py` to check transport type.
- Use the MCP inspector or simple python script to invoke tools on `main.py` if needed to verify "data" count, or logic in `test_scrape.py` might be enough if I can reuse the logic.
