import streamlit as st
from main import _search

st.title("MCP Search Demo 🚀")

st.markdown("""
This is a simple UI for the Question 6 Search Tool.
It uses the logic directly from `main.py`.
""")

query = st.text_input("Enter your search query:", value="demo")

# Add slider for number of results
num_results = st.slider("Number of results to show:", min_value=1, max_value=20, value=5)

if st.button("Search"):
    if query:
        with st.spinner("Searching..."):
            try:
                # Call the internal search function directly with num_results
                result = _search(query, num_results=num_results)
                st.subheader(f"Top {num_results} Results")
                # Use markdown to render the bold headers
                st.markdown(result)
            except Exception as e:
                st.error(f"Error: {e}")
    else:
        st.warning("Please enter a query.")

