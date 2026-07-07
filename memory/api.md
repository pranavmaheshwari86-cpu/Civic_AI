# API Documentation

> All endpoints prefixed `/api/v1`. JSON bodies unless noted. Mutating endpoints require `Content-Type: application/json` except complaint photo upload (multipart/form-data).

## Auth

### `POST /api/v1/auth/otp/request`
Request OTP for a phone number.

**Auth:** None  
**Rate limit:** Max 3 requests/hour/phone (`ratelimit:otp:{phone}` in Redis)  
**Request:** `{ "phone": "string (E.164)" }`  
**Success:** `200 { "message": "OTP sent" }`  
**Error:** `429 { "error": "rate_limited" }`

### `POST /api/v1/auth/otp/verify`
Verify OTP, get tokens.

**Auth:** None  
**Rate limit:** Max 3 attempts per OTP code (tracked in same Redis key, then invalidated)  
**Request:** `{ "phone": "string", "otp": "string" }`  
**Success:** `200 { "accessToken": "string", "user": { "id", "phone", "preferredLanguage" } }` + `refreshToken` in httpOnly secure SameSite=Strict cookie  
**Errors:** `400 { "error": "invalid_otp" }` / `410 { "error": "otp_expired" }`

### `POST /api/v1/auth/refresh`
Refresh access token.

**Auth:** Refresh token cookie  
**Success:** `200 { "accessToken": "string" }`

### `POST /api/v1/auth/logout`
Clear refresh cookie.

**Success:** `200 { "message": "logged out" }`

---

## Chat

### `POST /api/v1/chat/message`
Send message, get streamed AI response.

**Auth:** Optional (Bearer token or anonymous via session cookie)  
**Request:** `{ "conversationId": "string | null", "message": "string" }`  
**Response:** `200, Content-Type: text/event-stream`
```
SSE events:
  { "type": "token", "data": "string" }           — repeated (streaming text)
  { "type": "catalog_card", "data": {              — 0 or more
      "serviceId", "serviceName",
      "requiredDocuments", "portalUrl"
    }}
  { "type": "done", "data": {                      — terminal
      "messageId", "confidenceScore"
    }}
```
**Error:** `503` (LLM unavailable) → non-streamed static fallback response (top 5 cached catalog entries + complaint form link)

### `GET /api/v1/chat/conversations/:id`
Get conversation with messages.

**Auth:** Must own conversation (user ID or session match)  
**Success:** `200 { "id", "messages": [...], "language", "createdAt" }`  
**Errors:** `403` (not owner) / `404`

---

## Catalog & Schemes

### `GET /api/v1/services/search?q={query}&lang={en|hi}`
Search services by keyword (also used internally by chat RAG).

**Auth:** None  
**Success:** `200 { "results": [{ "serviceId", "serviceName", "description", "score" }] }`

### `POST /api/v1/schemes/match`
Match eligible schemes.

**Auth:** None  
**Request:** `{ "ageRange": "string", "occupationType": "string", "state": "string", "gender": "string | null" }`  
**Success:** `200 { "matches": [{ "schemeId", "schemeName", "description", "applicationUrl", "matchScore" }] }`

---

## Complaints

### `POST /api/v1/complaints`
File a new complaint.

**Auth:** OTP verified in same flow (phone + otp fields in request)  
**Content-Type:** `multipart/form-data`  
**Fields:** `category` (enum), `description`, `lat`, `lng`, `landmark` (optional), `photos[]` (0-3 files, max 5MB each, image/jpeg or image/png, magic-byte validated), `phone`, `otp`  
**Success:** `201 { "trackingId": "SB-XXXXXXXX", "status": "submitted", "possibleDuplicate": { "trackingId", "distanceMeters" } | null }`  
**Errors:** `400` (validation) / `401` (OTP not verified)

**Category enum:** `road_infrastructure`, `water_supply`, `sanitation_waste`, `streetlight_electrical`, `public_safety`, `other`

### `GET /api/v1/complaints/:trackingId`
Check complaint status (public).

**Auth:** None  
**Rate limit:** 20 requests/min/IP (prevents enumeration)  
**Success:** `200 { "trackingId", "category", "status", "statusHistory": [{ "status", "timestamp", "note" }], "createdAt", "updatedAt" }`  
**Error:** `404` (clear "not found" message, no PII leaked)

**Note:** No phone, photo URLs, or user details in response (privacy).

### `POST /api/v1/complaints/lookup`
List complaints by phone (for lost tracking ID).

**Auth:** Fresh OTP required (not stored session)  
**Request:** `{ "phone": "string", "otp": "string" }`  
**Success:** `200 { "complaints": [{ "trackingId", "category", "status", "createdAt" }] }`  
**Error:** `401` (invalid OTP)

### `POST /api/v1/complaints/:trackingId/merge-confirm`
Confirm or reject duplicate merge.

**Auth:** Bearer (must be complaint owner)  
**Request:** `{ "confirmed": "boolean" }`  
**Success:** `200 { "merged": "boolean" }`

---

## Feedback

### `POST /api/v1/feedback`
Submit feedback on an AI response.

**Auth:** None  
**Request:** `{ "messageId": "string", "rating": "up | down", "comment": "string | null" }`  
**Success:** `201 { "id": "string" }`

---

## Admin

All under `/api/v1/admin`, require admin JWT with role check.

### `POST /api/v1/admin/auth/login`
**Request:** `{ "email": "string", "password": "string" }`  
**Success:** `200 { "accessToken": "string" }`

### `GET /api/v1/admin/catalog/services`
Paginated list of all KB entries.

### `POST /api/v1/admin/catalog/services`
Create entry → triggers re-embedding BullMQ job.

### `PATCH /api/v1/admin/catalog/services/:id`
Update entry → triggers re-embedding job. Auto-sets `lastReviewedAt`, `reviewedBy`.

### `DELETE /api/v1/admin/catalog/services/:id`
Soft delete (`isActive: false`).

### `GET /api/v1/admin/complaints`
Paginated, filterable by status/category.

### `PATCH /api/v1/admin/complaints/:id/status`
**Request:** `{ "status": "string", "note": "string | null" }`  
Appends to `complaint_status_updates`.

---

## Auth Architecture

| User Type | Mechanism | Token Details |
|---|---|---|
| Citizen | Phone + OTP → JWT | Access: 15min, Bearer header. Refresh: 30d, httpOnly secure SameSite=Strict cookie |
| Anonymous | No token | `anonymousSessionId` in non-httpOnly cookie for conversationId persistence |
| Admin | Email/password → JWT | Separate `ADMIN_JWT_SECRET`, role-based guard (`editor` / `admin`) |

All JWTs signed with HS256 via `@nestjs/jwt`.
