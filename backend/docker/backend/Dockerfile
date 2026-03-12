# backend/docker/backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

# Copy requirements first (better Docker caching)
COPY requirements.txt .
COPY requirements-dev.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements-dev.txt

# Copy application code
COPY . .

# Expose API port
EXPOSE 8000

# Start FastAPI with uvicorn
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]