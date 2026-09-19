# AgentSponsor

Your agent is thinking. Let it pay you.

## Status

Early development.

## What it will do

AgentSponsor is intended to display clearly labeled sponsorship content during Antigravity agent working time while preserving the normal Antigravity experience.

Eligible sponsorship revenue may be shared with developers.

## Architecture

```
Antigravity
     ↓
AgentSponsor Plugin
     ↓
AgentSponsor API
     ↓
Supabase
     ↓
Developer Dashboard
```

## Development

### Plugin

The plugin directory contains the Antigravity CLI plugin configuration.

To test plugin discovery:
- Ensure `plugin.json` and `hooks.json` are present in `plugin/`.
- Refer to [docs/antigravity-compatibility.md](docs/antigravity-compatibility.md) for details on Antigravity CLI integration.

### Backend

The backend is built with Python, FastAPI, and Pydantic.

To set up and run:
1. Navigate to `backend/`
2. Install dependencies: `pip install -r requirements.txt`
3. Run tests: `pytest`
4. Start dev server: `uvicorn app.main:app --reload`

### Frontend

The frontend web dashboard is built with Next.js, TypeScript, and Tailwind CSS.

To set up and run:
1. Navigate to `web/`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Build for production: `npm run build`
