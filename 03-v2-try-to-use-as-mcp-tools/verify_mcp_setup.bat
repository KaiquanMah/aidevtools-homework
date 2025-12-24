@echo off
REM MCP Server Verification Script for Windows
REM This script helps verify that your MCP server setup is working correctly

echo ==========================================
echo MCP Server Verification Script
echo ==========================================
echo.

REM Step 1: Check if Docker is available
echo Step 1: Checking if Docker is available...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker is installed
    docker --version
) else (
    echo [ERROR] Docker is not found in PATH
    echo    Please install Docker Desktop and ensure it's running
    exit /b 1
)
echo.

REM Step 2: Check if Docker daemon is running
echo Step 2: Checking if Docker daemon is running...
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker daemon is running
) else (
    echo [ERROR] Docker daemon is not running
    echo    Please start Docker Desktop
    exit /b 1
)
echo.

REM Step 3: Check if mcp-homework image exists
echo Step 3: Checking if mcp-homework Docker image exists...
docker images | findstr "mcp-homework" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] mcp-homework image found
    docker images | findstr "mcp-homework"
) else (
    echo [WARNING] mcp-homework image not found
    echo    Building the image now...
    docker build -t mcp-homework .
    if %errorlevel% equ 0 (
        echo [OK] Image built successfully
    ) else (
        echo [ERROR] Failed to build image
        exit /b 1
    )
)
echo.

REM Step 4: Test the wrapper script
echo Step 4: Testing the MCP server startup...
echo    Starting server for 15 seconds to verify it works...
echo    (You should see the FastMCP welcome screen)
echo.

REM Start the server and stop it after a few seconds
start /B docker run --rm -i mcp-homework uv run python main.py
@REM old
@REM timeout /t 3 /nobreak >nul
@REM new - below
%SystemRoot%\System32\timeout.exe /t 15 /nobreak >nul
taskkill /F /IM docker.exe >nul 2>&1

echo.
echo [OK] If you saw the FastMCP welcome screen above, the server is working!
echo.

REM Step 5: Summary
echo ==========================================
echo Verification Summary
echo ==========================================
echo.
echo If all checks passed, your MCP server is ready to use!
echo.
echo Next steps:
echo 1. Verify MCP configuration in Antigravity IDE:
echo    - Click '...' -^> 'MCP Servers' -^> 'Manage MCP Servers'
echo    - Check that 'homework-search' is listed and connected
echo.
echo 2. Test with a simple prompt in Antigravity:
echo    "Please use the add tool from the homework-search MCP server to add 5 and 3."
echo.
echo 3. Test the search tool:
echo    "Please use the search tool from the homework-search MCP server to find information about 'demo'."
echo.

pause
