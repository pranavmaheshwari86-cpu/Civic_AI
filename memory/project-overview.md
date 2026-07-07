# Project Overview

## Purpose

Smart Bharat is a GenAI-powered web platform that lets Indian citizens discover government services, file and track civic complaints, and get plain-language answers to bureaucratic questions through a multilingual AI companion.

## Problem

Government services in India are fragmented across hundreds of departmental websites with different portals, form formats, and jargon. Citizens with low digital literacy, limited English, or no prior knowledge of government structure are forced to pay middlemen, visit wrong offices, or abandon requests entirely.

## Main Features (v1 Must-Have)

1. **AI Companion chat interface** — text-based conversational UI, streaming responses
2. **Intent classification & routing** — maps free-text to service category (documents, complaints, scheme lookup, general info)
3. **Government service knowledge base** — curated database of services, departments, documents, official links
4. **Document checklist generator** — per-service checklist based on user's stated situation
5. **Civic complaint filing** — category, description, optional photo, optional geolocation
6. **Complaint tracking** — unique tracking ID, status stepper (Submitted → Under Review → In Progress → Resolved → Closed)
7. **Multilingual support** — Hindi + English at launch, auto-detect input language
8. **Scheme/service recommendation** — based on basic profile (age, occupation, state)
9. **Session-based conversation history** — scroll back within session, no cross-device sync
10. **Basic user account** — phone + OTP, required only for filing/tracking complaints
11. **Feedback mechanism** — thumbs up/down on AI responses, "this didn't help" escalation
12. **Admin content management** — internal tool to add/edit/update knowledge base entries

## User Personas

| Persona | Age | Context | Primary Need | Language |
|---|---|---|---|---|
| Rekha | 52 | Shop owner, Tier-2 city | Renew trade license, doesn't know which office | Hindi |
| Arjun | 24 | Graduate, urban | Fast answers, direct links, no PDFs | English |
| Devendra | 61 | Retired, semi-rural | Report civic issues, needs visible tracking | Hindi |
| Fatima | 35 | Informal sector, urban | Discover eligible welfare schemes | Hindi |

**Usage context:** ~70% mobile web, short task-driven sessions.

## Overall Workflow

1. **Landing** — chat input front-and-center + quick-action chips (Report issue, Find service, Track complaint, Check eligibility). No login wall.
2. **Language** — auto-detect from first message, persistent toggle in header. No blocking modal.
3. **Query path** — free-text → AI response → structured card (service name, docs checklist, "Go to official portal" button).
4. **Complaint path** — conversational follow-ups (category, location, optional photo) → OTP verification at submission → tracking ID displayed.
5. **Tracking** — enter tracking ID or phone+OTP → horizontal status stepper with timestamps.
6. **Scheme discovery** — 2-3 profiling questions → matching schemes with eligibility + official links.
