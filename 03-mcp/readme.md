# Model Context Protocol (MCP)

In this homework, we will build our own MCP server - a clone of Context7 (https://context7.com/).

For that, we will need:
- Select a GitHub repo with documentation - eg https://github.com/feature-engine/feature_engine
- Download the data from it
- Make it searchable
- Please create a docker container for the project, then install libraries inside the container, to avoid conflicts with other packages on the local machine


## Question 1: Create Project

Create a project. We will use `uv` for dependency management. Install it if you don't have it:

```bash
pip install uv
```

Create a directory and initialize an empty project there:

```bash
uv init
```

Install fastmcp:

```bash
uv add fastmcp
``` 


In `uv.lock`, what's the first hash in the `wheels` section of `fastmcp`? Include the entire string without quotes.
* Q1 Answer (Hash): sha256:fb3e365cc1d52573ab89caeba9944dd4b0561449097be169bce428e011f0a57e5


## Question 2: FastMCP Transport

Now let's update the main file.

Use the starter code from [their docs](https://github.com/jlowin/fastmcp):

```python
from fastmcp import FastMCP

mcp = FastMCP("Demo 🚀")

@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

if __name__ == "__main__":
    mcp.run()
```


Run the server.

You'll see the welcome screen. What's the transport?
* STDIO  
* HTTP
* HTTPS
* SSE

Q2 Answer (Transport): STDIO


## Question 3: Scrape Web Tool

Now let's create a tool for downloading content of any web page. 

We'll use Jina reader for that.

To get content of any page in markdown, you simply need to add `r.jina.ai` in front of the address. For example: `https://r.jina.ai/https://datatalks.club`

Ask your AI assistant to create a tool based on this. You can ask it to use the `requests` library. 

I also recommend testing it. I used a prompt like that:

```
Create a file `test.py` which invokes this function to test that it works well
```

Test it to retrieve the content of `https://github.com/alexeygrigorev/minsearch`. How many characters does it return? 


* 1184
* 9184
* 19184
* 29184

Select the closest answer if you don't get the exact match.
* Q3 answer: 29,184 (closest option)
  * The content length returned was **31,361** characters.


## Question 4: Integrate the Tool

Integrate the MCP tool into your AI assistant. 

The command for running the MCP server is this:

```bash
uv --directory ~/path/to/homework run python main.py
```

(or `C:/Users/username/path/to/homework` if you're on Windows)

Replace the directory with the full path to this project

Ask it the following:

```
Count how many times the word "data" appears on https://datatalks.club/
Use available MCP tools for that
```

What's the answer?

* 61
* 111
* 161
* 261

Select the closest answer if you don't get the exact match.
* Q4 answer: 61 (using case-insensitive matching)


## Question 5: Implement Search (2 points)

Now ask the agent to: 

* Download https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip. Don't download it if it's already downloaded
* Iterate over all zip files but read only md and mdx ones 
* Remove the first part of the path in the filename. So "fastmcp-main/docs/getting-started/welcome.mdx" becomes "docs/getting-started/welcome.mdx"
* Index these files with minsearch. Put the text content in "content" field and filename in "filename" 
* Use https://github.com/alexeygrigorev/minsearch to learn how to use minsearch
* Create a search function that retrieves 5 most relevant documents from the index
* Create search.py and test the implementation there

What's the first file returned that you get with the query "demo"? 

* README.md
* docs/servers/context.mdx
* examples/testing_demo/README.md
* docs/python-sdk/fastmcp-settings.mdx

Q5 answer: examples/testing_demo/README.md


## Question 6: Search Tool (ungraded)

Now you can ask your assistant to implement it as a tool in main.py - and voila, you have a documentation search engine in your AI assistant!

