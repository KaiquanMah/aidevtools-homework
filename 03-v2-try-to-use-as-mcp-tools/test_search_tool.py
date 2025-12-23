from main import _search

def test_search_tool():
    query = "demo"
    print(f"Testing search tool with query: '{query}'")
    try:
        # We rely on main.py executing setup_search() on import
        # The import above should have triggered it.
        result = _search(query)
        if result:
            print("Search successful!")
            print(f"Result length: {len(result)}")
            print("First 200 chars:")
            print(result[:200])
        else:
            print("Search returned empty result.")
    except Exception as e:
        print(f"Search failed with error: {e}")

if __name__ == "__main__":
    test_search_tool()
