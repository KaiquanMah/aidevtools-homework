import requests
import zipfile
import io
import os
from minsearch import Index

def setup_search():
    # 1. Download zip
    url = "https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip"
    print(f"Downloading {url}...")
    response = requests.get(url)
    response.raise_for_status()
    
    # 2. Iterate and read files
    print("Processing zip file...")
    documents = []
    
    with zipfile.ZipFile(io.BytesIO(response.content)) as z:
        for file_info in z.infolist():
            if file_info.is_dir():
                continue
            
            # Filter for md and mdx
            # read these 2 types of files only
            if not (file_info.filename.endswith(".md") or file_info.filename.endswith(".mdx")):
                continue
                
            # 3. Clean filename (remove first part of path)
            # The structure is usually fastmcp-main/path/to/file
            #     split for a max of 1 time
            #     so "fastmcp-main/docs/getting-started/welcome.mdx" 
            #     becomes ["fastmcp-main", "docs/getting-started/welcome.mdx"]
            parts = file_info.filename.split("/", 1)
            if len(parts) > 1:
                clean_filename = parts[1]
            else:
                clean_filename = file_info.filename
                
            # Read content
            try:
                content = z.read(file_info).decode("utf-8")
                documents.append({
                    "filename": clean_filename,
                    "content": content
                })
            except Exception as e:
                print(f"Skipping {file_info.filename}: {e}")
                
    print(f"Indexed {len(documents)} documents.")

    # 4. Index with minsearch
    #    teach the indez
    #    how to retrieve the filename / content k-v pairs
    #    from 'documents', i.e. the list of dictionaries
    index = Index(
        text_fields=["content"],
        keyword_fields=["filename"]
    )
    
    index.fit(documents)
    return index


def run_search_demo():
    index = setup_search()
    
    query = "demo"
    print(f"Searching for query: '{query}'")
    
    # 5. Retrieve 5 most relevant
    results = index.search(
        query=query,
        boost_dict={"content": 1},
        num_results=5
    )
    
    print("\nResults:")
    for i, result in enumerate(results):
        print(f"{i+1}. {result['filename']}")
        
    if results:
        print(f"\nFirst file returned: {results[0]['filename']}")

if __name__ == "__main__":
    run_search_demo()
