from main import _scrape_web_page as scrape_web_page

def count_data_occurrences():
    url = "https://datatalks.club/"
    print(f"Scraping URL: {url}")
    try:
        content = scrape_web_page(url)
        if content:
            # The question asks "Count how many times the word 'data' appears"
            # It's usually case-insensitive in these contexts, or exact match?
            # The options are 61, 111, 161, 261. 
            # I will try (lower case) count first, as "data" is a common word.
            # But usually "word 'data'" implies the string "data".
            # Let's count substring "data" cases-insensitive first.
            
            count_lower = content.lower().count("data")
            print(f"Count of 'data' (case-insensitive): {count_lower}")
            
            count_exact = content.count("data")
            print(f"Count of 'data' (exact match): {count_exact}")
            
        else:
            print("Failed to get content.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    count_data_occurrences()
