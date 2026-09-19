# Contributing Guidelines

Thank you for considering contributing to AgentSponsor!

## Branch Naming

Use clear descriptive names for branches:
- Feature branches: `feat/feature-name`
- Bug fixes: `fix/bug-description`
- Chore/Maintenance: `chore/task-name`
- Documentation: `docs/topic-name`

## Commit Style

Follow Conventional Commits guidelines:
- `feat: add new feature`
- `fix: resolve issue`
- `chore: update dependencies or setup`
- `docs: update documentation`

Keep commit messages concise, imperative, and descriptive.

## Pull Requests

1. Fork/branch from `main`.
2. Ensure code builds clean and all tests pass before opening a PR.
3. Provide a clear summary of changes in the PR description.
4. Obtain code review approval before merging.

## Tests Required

- All backend changes must include corresponding unit tests in `backend/tests/`.
- All frontend changes must build cleanly with `npm run build`.
- CI workflows must pass before merging.

## Security & Privacy Guidelines

- **No Secrets in Commits**: Never check in credentials, API keys, secrets, or `.env` files. Ensure `.env.example` contains only empty placeholders.
- **No Prompt or Source Code Collection**: The AgentSponsor plugin must strictly process state metadata and must **never** collect, transmit, or log user prompts, project source code, or conversation transcripts.
