import streamlit as st
from main import _search

st.title("MCP Search Demo 🚀")

st.markdown("""
This is a simple UI for the Question 6 Search Tool.
Search any GitHub repository's documentation!
""")

# Repository URL input
repo_url = st.text_input(
    "GitHub Repository URL (zip format):",
    value="https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip",
    help="Enter the GitHub archive URL (e.g., https://github.com/user/repo/archive/refs/heads/main.zip)"
)

query = st.text_input("Enter your search query:", value="demo")

# Add slider for number of results
num_results = st.slider("Number of results to show:", min_value=1, max_value=20, value=5)

if st.button("Search"):
    if query and repo_url:
        with st.spinner(f"Downloading and indexing {repo_url}..."):
            try:
                # Call _search from main.py with repo_url parameter
                result = _search(query, num_results=num_results, repo_url=repo_url)
                st.header(f"Top {num_results} Results")
                # Use markdown to render the formatted results
                st.markdown(result)
            except Exception as e:
                st.error(f"Error: {e}")
                import traceback
                st.code(traceback.format_exc())
    else:
        st.warning("Please enter both a query and repository URL.")

