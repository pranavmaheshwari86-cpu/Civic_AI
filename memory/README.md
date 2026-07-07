# Smart Bharat — Project Memory

**Project:** Smart Bharat — AI-Powered Civic Companion  
**Version:** PRD v1.0  
**Status:** Pre-development (greenfield)

This directory is the single source of truth for the project. Every development session starts by reading these files.

## File Index

| File | Contents |
|---|---|
| `project-overview.md` | Purpose, features, personas, workflow |
| `architecture.md` | Folder structure, frontend/backend/auth/data flow |
| `tech-stack.md` | Frameworks, libraries, DB, APIs, third-party |
| `coding-standards.md` | Conventions inferred from codebase |
| `business-rules.md` | All business logic rules |
| `current-status.md` | Completed, in-progress, known limitations |
| `decisions.md` | Architectural/implementation decisions + rationale |
| `bugs.md` | Known bugs, workarounds, recently fixed |
| `api.md` | Endpoints, request/response formats, auth |
| `database.md` | Collections, relationships, fields, indexes |
| `deployment.md` | Env vars, process, URLs, build commands |
| `todo.md` | Prioritized remaining work |
| `changelog.md` | Chronological change log |

## Maintenance Rules

1. Read every file in this directory before making code changes.
2. Treat this memory as the project's source of truth.
3. After completing work:
   - Update only the relevant memory files.
   - Record architectural changes.
   - Update project status.
   - Record newly discovered business rules.
   - Add any new API endpoints.
   - Update database documentation if schemas changed.
   - Update TODO items.
   - Add a concise entry to the changelog.
4. Never overwrite existing information unless it is no longer correct.
5. Keep documentation concise, accurate, and synchronized with the codebase.
6. Do not duplicate information across files.
7. When uncertain, inspect the code before updating memory.
8. If a memory file becomes too large, reorganize into smaller documents.
