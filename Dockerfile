FROM python:3.11-slim

WORKDIR /app

# Install dependencies from backend
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code into container root
COPY backend/ ./

ENV PYTHONPATH=/app
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
