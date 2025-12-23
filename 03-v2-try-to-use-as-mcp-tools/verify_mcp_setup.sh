#!/bin/bash
# MCP Server Verification Script
# This script helps verify that your MCP server setup is working correctly

echo "=========================================="
echo "MCP Server Verification Script"
echo "=========================================="
echo ""

# Step 1: Check if Docker is running
echo "Step 1: Checking if Docker is available..."
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    docker --version
else
    echo "❌ Docker is not found in PATH"
    echo "   Please install Docker Desktop and ensure it's running"
    exit 1
fi
echo ""

# Step 2: Check if Docker daemon is running
echo "Step 2: Checking if Docker daemon is running..."
if docker info &> /dev/null; then
    echo "✅ Docker daemon is running"
else
    echo "❌ Docker daemon is not running"
    echo "   Please start Docker Desktop"
    exit 1
fi
echo ""

# Step 3: Check if mcp-homework image exists
echo "Step 3: Checking if mcp-homework Docker image exists..."
if docker images | grep -q "mcp-homework"; then
    echo "✅ mcp-homework image found"
    docker images | grep "mcp-homework"
else
    echo "❌ mcp-homework image not found"
    echo "   Building the image now..."
    docker build -t mcp-homework .
    if [ $? -eq 0 ]; then
        echo "✅ Image built successfully"
    else
        echo "❌ Failed to build image"
        exit 1
    fi
fi
echo ""

# Step 4: Test the wrapper script
echo "Step 4: Testing the MCP server startup..."
echo "   Starting server for 3 seconds to verify it works..."
echo "   (You should see the FastMCP welcome screen)"
echo ""

# Run the server in background and capture output
timeout 3s docker run --rm -i mcp-homework uv run python main.py 2>&1 | head -n 30

if [ $? -eq 124 ]; then
    echo ""
    echo "✅ Server started successfully (timed out as expected)"
else
    echo ""
    echo "⚠️  Server exited unexpectedly. Check the output above for errors."
fi
echo ""

# Step 5: Summary
echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo ""
echo "If all checks passed, your MCP server is ready to use!"
echo ""
echo "Next steps:"
echo "1. Verify MCP configuration in Antigravity IDE:"
echo "   - Click '...' → 'MCP Servers' → 'Manage MCP Servers'"
echo "   - Check that 'homework-search' is listed and connected"
echo ""
echo "2. Test with a simple prompt in Antigravity:"
echo "   'Please use the add tool from the homework-search MCP server to add 5 and 3.'"
echo ""
echo "3. Test the search tool:"
echo "   'Please use the search tool from the homework-search MCP server to find information about \"demo\".'"
echo ""
