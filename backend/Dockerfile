FROM python:3.11-slim

WORKDIR /app

# Copy requirements regardless of build context (whether context is root or backend/)
COPY requirements.txt* backend/requirements.txt* ./
RUN if [ -f "requirements.txt" ]; then pip install --no-cache-dir -r requirements.txt; elif [ -f "backend/requirements.txt" ]; then pip install --no-cache-dir -r backend/requirements.txt; fi

COPY . .

ENV PYTHONPATH=/app/backend:/app
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "if [ -d \"app\" ]; then uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}; else uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}; fi"]
