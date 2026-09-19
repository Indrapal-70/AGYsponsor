# AgentSponsor Backend API

FastAPI service for AgentSponsor.

## Requirements

- Python 3.10+
- FastAPI
- Pydantic
- Uvicorn

## Installation & Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running Tests

```bash
pytest
```

## Running the API Server

```bash
uvicorn app.main:app --reload --port 8000
```

Health check endpoint will be available at `http://localhost:8000/health`.
