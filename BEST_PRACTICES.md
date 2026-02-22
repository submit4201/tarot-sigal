# Codebase Best Practices

Adhering to these best practices will ensure long-term maintainability, readability, and a streamlined developer experience.

## 1. Directory Structure Organization
Keeping the project structured is the primary way to maintain sanity as the codebase grows.
- **`src/` or `server/`**: The core application code should live in specific backend/frontend workspaces.
- **`.log/` and `.test/`**: Should strictly follow the same directory structure internally as the project's logic components.
- **`scripts/`**: Maintain all external operation tools (e.g., TODO parsing, deploy scripts, db migrations) clearly in this directory.

## 2. API & Backend Design (`server/`)
- **FastAPI / Python Standards**: Utilize Pydantic models (V2 semantics) for data validation. Prefer native `Union[list, Json]` wrappers over custom validators for nested database JSON blobs.
- **Strict Typing**: Ensure all endpoints have strict typed parameter definitions and accurate `response_model` annotations.
- **Database Operations**: Avoid committing incomplete transactions. Always wrap multi-part DB operations in `try/except/finally` or ensure `db.rollback()` is available in the event of an error.
- **CORS & Environment Variables**: Maintain separation of `.env` files for staging, production, and testing. Do not hardcode database URLs or secure string literals anywhere in the backend logic.

## 3. Frontend Architecture (`src/`)
- **Immutability Data Patterns**: Prefer using React hooks thoughtfully (e.g., `useState`, `useQuery`). Do not manually mutate DOM or component state.
- **Aesthetics First**: Modern design, glassmorphism, dynamic animations, hover micro-interactions, and premium UI decisions should be implemented using styling utilities or robust frameworks like Tailwind CSS, framed within standard Vanilla CSS when necessary.
- **State Management**: If data needs to be accessed globally, use a well-structured Context or global store rather than prop-drilling more than 2-levels deep.

## 4. Documentation & Communication
- Every complex module or system should have a high-level markdown overview explaining the flow (e.g., `IMPLEMENTATION_SUMMARY.md`).
- Utilize the commenting standards (TODOs, FIXMEs, `!`, `?`, `*`, `[ ]`) effectively in every sprint to ensure automated ingestion catches future refactoring tasks.

## 5. Security Practices
- Ensure that Authentication/JWT algorithms are robust and secrets are explicitly omitted from Git tracking (`.gitignore` must contain `.env`, `.log/`, `.todo/`, etc).
- Regularly run dependency audits on `package.json` for frontend and `requirements.txt` for backend environments.

## 6. Sprints & Git Workflow
- Development should occur strictly on `feature/` or `fix/` branches.
- Commit messages should be highly descriptive of the "Why" and not just the "What." Example: *Fix: Correct Appwrite OAuth endpoint matching for correct environment callback.*
- The sequence for contributing is: *Branch Context -> Write Code -> Test (`.test/`) -> Review -> Commit -> Code Review -> Merge.*
