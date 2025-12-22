import streamlit as st
from main import _search

st.title("MCP Search Demo 🚀")

st.markdown("""
This is a simple UI for the Question 6 Search Tool.
It uses the logic directly from `main.py`.
""")

query = st.text_input("Enter your search query:", value="demo")

if st.button("Search"):
    if query:
        with st.spinner("Searching..."):
            try:
                # Call the internal search function directly
                # In a real MCP setup, you'd use an MCP client to call the server
                result = _search(query)
                st.subheader("Results")
                st.text(result)
            except Exception as e:
                st.error(f"Error: {e}")
    else:
        st.warning("Please enter a query.")
