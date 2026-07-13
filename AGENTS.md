# GLOBAL TASK ORCHESTRATION PROTOCOL

## STEP 1 — CAPABILITY DISCOVERY
At the start of every task, load the capability registry (Skills, MCPs, Agents).
Reuse the cached map if it's still valid. Only refresh if the registry changed, the cache is stale, or a prior capability mismatch occurred.
Also view the Code Review Graph before starting — it holds accumulated context from prior reviews (past findings, patterns, known issues) and must inform how the current task is approached.
Use `memory` for business rules and high-level project context, `graphify-out` to map code dependencies and architectural structure, and `.code-review-graph` to learn from past mistakes and assess the impact radius of new changes.

## STEP 2 — TASK ANALYSIS
Break the task into: primary goal, required sub-tasks, and the type of each sub-task.

## STEP 3 — MANDATORY CAPABILITY SELECTION (BEFORE EXECUTION)
> No skill, MCP, or agent is loaded automatically "just in case." Selection happens explicitly, per task, every time — this replaces any global auto-loading behavior.

### Always-On (mandatory, every task, no exceptions):
- **Skill: `token-saver`** — always active. Be concise. Stop once the goal is achieved.
- **Skill: `ponytail`** — always active. Apply code quality and review standards.
- **MCP: `ruflo`** — always active. Use for orchestration, memory, and workflows.
- **Agent: `agency-agents`** — always active alongside the primary agent/skill for every task.
- **Resources: `memory`, `graphify-out`, `.code-review-graph`** — Use `memory` for business rules and high-level project context, `graphify-out` to map code dependencies and architectural structure, and `.code-review-graph` to learn from past mistakes and assess the impact radius of new changes. Always update `.code-review-graph`, `memory`, and `graphify-out` after the task is completed, and use each according to the needs of the task.
- **Skill: `verification-before-completion`** — always active. Never claim work is done, fixed, or passing without actually verifying it first.
- **Skill: `safety-guardrails`** — always active. Enforce guardrails on any destructive or irreversible operation; prefer reversible changes.

### Per-Task Selection (dynamic — no lazy loading):
- Match each sub-task against the most specific available skill / MCP / agent.
- Load only what the task genuinely requires — never the full registry by default.
- If no skill matches, fall back to `general-assistant` mode.
- Never invoke a capability "just in case."

### Required output before execution:
`[SKILLS SELECTED: ...] [MCPs SELECTED: ...] [AGENTS SELECTED: ... | NONE] [FALLBACK: general-assistant | N/A]`

## STEP 4 — EXECUTION
Run selected capabilities. Parallel for independent sub-tasks, sequential for dependent ones.

## STEP 5 — VERIFICATION & FALLBACK
Verify each sub-task's output. On failure, report what failed and fall back to a direct approach.

## STEP 6 — CODE REVIEW GRAPH UPDATE (MANDATORY)
After every task finishes, update the Code Review Graph with: what was reviewed/changed, findings, decisions made, and any new patterns worth remembering for future tasks. This step is never skipped, including on partial or failed completions.

## OUTPUT FORMAT (every response)
`[PRIMARY MODE: ] [MCPs USED: ] [SKILLS USED: ] [AGENTS USED: ]`

---

# ALWAYS-ON GLOBALS
| Capability | Scope | Rule |
|---|---|---|
| `token-saver` skill | GLOBAL | Concise. Stop early. |
| `ponytail` skill | GLOBAL | Code quality standards. |
| `ruflo` MCP | GLOBAL | Orchestration + memory. |
| `agency-agents` agent | GLOBAL | Active alongside primary agent/skill on every task. |
| Code Review Graph | GLOBAL | View before starting; update after every task finishes. |
| `verification-before-completion` skill | GLOBAL | No completion/success claims without actual verification. |
| `safety-guardrails` skill | GLOBAL | Guardrails on destructive/irreversible operations. |
| Context Optimizer | GLOBAL | Run before every model call. |
| Memory / History | GLOBAL | Persist across sessions. |
| Session Persistence | GLOBAL | Restore context per workspace. |
| Error Recovery | GLOBAL | Retry with a different strategy on failure. |

Everything else — every other skill, MCP, and agent — is loaded **only** through Step 3's per-task selection. Nothing outside this table is loaded globally or by default.

---

# AUTO ROUTING MAP
- debugging → `error-detective` + `debugging-toolkit` + `filesystem` MCP
- performance → `performance-engineer` + `web-performance-optimization`
- system design → `software-architecture` + `backend-architect`
- security → `security-audit` + `vulnerability-scanner`
- frontend UI/UX → `frontend-developer` + `ui-ux-designer`
- backend/APIs → `backend-developer` + `nodejs-backend-patterns` + `github` MCP
- AI/ML → `ml-engineer` + `data-scientist`
- automation → `workflow-automation` + `ruflo` MCP
- git/repo → `github` MCP + `code-reviewer`
- unknown → `general-assistant`

Debugging
├─ Error Detective
├─ Debugging Toolkit
├─ Filesystem MCP
├─ Logs Analyzer
└─ Root Cause Analyzer

Frontend
├─ Frontend Developer
├─ UI/UX Designer
├─ React
├─ Next.js
├─ Tailwind
├─ Accessibility

Backend
├─ Backend Developer
├─ API Patterns
├─ Node Backend
├─ Database
├─ Auth
├─ Caching

Performance
├─ Performance Engineer
├─ Bundle Analysis
├─ Rendering
├─ Profiling
├─ Database
└─ Caching

Security
├─ Security Audit
├─ Vulnerability Scanner
├─ API Security
├─ Auth
├─ Dependency Scan
└─ Secrets Detection

AI
├─ AI Engineer
├─ ML Engineer
├─ Data Scientist
├─ Prompt Engineering
├─ RAG
└─ Agent Architecture

DevOps
├─ Docker
├─ CI/CD
├─ Deployment
├─ Kubernetes
├─ Cloud
└─ Monitoring

Automation
├─ Workflow Automation
├─ Ruflo
├─ GitHub MCP
├─ Browser Automation
└─ Agent Manager

Git
├─ GitHub MCP
├─ Code Reviewer
├─ PR Review
├─ Release Manager
└─ Changelog

Architecture
├─ Software Architecture
├─ System Design
├─ ADR
├─ Scalability
└─ Distributed Systems

Testing
├─ Unit Testing
├─ Integration Testing
├─ Playwright
├─ QA Automation
├─ Accessibility Testing
└─ Visual Regression

Documentation
├─ API Docs
├─ README
├─ Technical Writer
└─ Architecture Docs

---

# STRICT SYSTEM RULES
- NEVER load skills, MCPs, or agents globally "by default" — Step 3 selection is mandatory for every task.
- NEVER skip `token-saver`, `ponytail`, `ruflo`, `agency-agents`, `verification-before-completion`, or `safety-guardrails` — they are the only always-on capabilities.
- NEVER finish a task without updating the Code Review Graph — view it before starting, update it after finishing, no exceptions.
- NEVER hallucinate MCPs, plugins, or skills that aren't in the registry.
- ALWAYS use the most specific matching skill for each sub-task.
- ALWAYS fall back to `general-assistant` if no skill matches.
- NEVER claim `ruflo`, `agency-agents`, or the Code Review Graph were used unless they were actually available and accessed.
- Prefer `ruflo` whenever it is available.
- Prefer the Code Review Graph whenever it is available.
- Fall back gracefully when capabilities are unavailable.