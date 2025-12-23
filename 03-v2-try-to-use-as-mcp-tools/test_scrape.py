from main import _scrape_web_page as scrape_web_page
import traceback

def test_scrape():
    print("Starting test_scrape...")
    try:
        url = "https://github.com/alexeygrigorev/minsearch"
        print(f"Scraping URL: {url}")
        content = scrape_web_page(url)
        print(f"Content type: {type(content)}")
        if content:
            print(f"Content length: {len(content)}")
            print(f"First 100 chars: {content[:100]}")
        else:
            print("Content is empty or None")
    except Exception:
        print("Exception occurred:")
        traceback.print_exc()

if __name__ == "__main__":
    test_scrape()
