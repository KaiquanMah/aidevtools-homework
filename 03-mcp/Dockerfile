FROM python:3.12-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Install Node.js and npm (required for fastmcp dev / MCP Inspector UI)
RUN apt-get update && apt-get install -y \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Create a virtual environment and install dependencies
# We use --system to install into the system python since we are in a container, 
# but uv prefers virtualenvs. Let's stick to uv's default or just use uv run.
# Actually, for development, we can just let uv manage the venv.

# Initialize project if not exists
RUN uv init

# Install dependencies
RUN uv add fastmcp requests minsearch pandas scikit-learn streamlit

# Expose port for Streamlit
EXPOSE 8501

# Default command
CMD ["uv", "run", "python", "main.py"]
