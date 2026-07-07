# Database

> MongoDB Atlas (M10 tier, AWS ap-south-1 Mumbai). All collections below use `_id` (ObjectId) as implicit primary key.

## Collections

### 1. `users`
Citizens who have verified their phone.

| Field | Type | Notes |
|---|---|---|
| phone | string | E.164 format, unique, indexed |
| phoneVerified | boolean | |
| preferredLanguage | string | ISO 639-1 (`"hi"` / `"en"`) |
| createdAt | Date | |
| lastActiveAt | Date | |

### 2. `conversations`
Chat sessions (authenticated or anonymous).

| Field | Type | Notes |
|---|---|---|
| userId | ObjectId / null | null = anonymous session |
| anonymousSessionId | string / null | Set when userId is null, from httpOnly cookie |
| language | string | Detected/selected |
| status | string | `"active"` / `"archived"` |
| createdAt | Date | |
| updatedAt | Date | |

### 3. `messages`
Individual chat messages within conversations.

| Field | Type | Notes |
|---|---|---|
| conversationId | ObjectId | Indexed |
| role | string | `"user"` / `"assistant"` |
| content | string | |
| intentCategory | string / null | `"document_info"` / `"complaint"` / `"scheme_lookup"` / `"general"` / `"unknown"` |
| retrievedCatalogIds | ObjectId[] | Catalog entries used for RAG grounding |
| confidenceScore | number / null | 0-1, only on assistant messages |
| createdAt | Date | |

**Indexes:** `conversationId`

### 4. `service_catalog`
Government services knowledge base.

| Field | Type | Notes |
|---|---|---|
| serviceName | string | |
| department | string | |
| category | string | e.g. `"identity_documents"`, `"civic_utilities"`, `"business_licenses"` |
| description | `{ en: string, hi: string }` | Multilingual |
| requiredDocuments | `[{ label: { en, hi }, conditionalOn: string / null }]` | Conditional per situation |
| officialPortalUrl | string | |
| applicableStates | string[] | Empty = national |
| embedding | number[] | 1024-dim Voyage voyage-2 output |
| lastReviewedAt | Date | Auto-set on admin save |
| reviewedBy | ObjectId | Ref → admin_users |
| isActive | boolean | Soft delete flag |

**Indexes:** Atlas Vector Search index (1024 dimensions, cosine similarity), `category`, `applicableStates`, `isActive`

### 5. `scheme_catalog`
Government welfare schemes.

| Field | Type | Notes |
|---|---|---|
| schemeName | string | |
| description | `{ en: string, hi: string }` | |
| eligibilityCriteria | object | `{ ageMin, ageMax, occupationTypes[], applicableStates[], genderRestriction, incomeThresholdMax }` |
| benefitsDescription | `{ en: string, hi: string }` | |
| applicationUrl | string | |
| department | string | |
| embedding | number[] | 1024-dim |
| isActive | boolean | |
| lastReviewedAt | Date | |

**Indexes:** Vector search index, `isActive`, `eligibilityCriteria.applicableStates`

### 6. `complaints`
Civic complaints filed by citizens.

| Field | Type | Notes |
|---|---|---|
| trackingId | string | Unique, `SB-XXXXXXXX` format (nanoid), indexed |
| userId | ObjectId | Indexed |
| category | string | Fixed enum: `road_infrastructure`, `water_supply`, `sanitation_waste`, `streetlight_electrical`, `public_safety`, `other` |
| description | string | |
| location.lat | number | |
| location.lng | number | |
| location.address | string / null | From Google Geocoding reverse lookup |
| location.landmark | string / null | Manual fallback entry |
| photoUrls | string[] | R2 signed URLs, max 3 |
| status | string | `"submitted"` / `"under_review"` / `"in_progress"` / `"resolved"` / `"closed"` |
| duplicateOfComplaintId | ObjectId / null | |
| confidenceFlag | string | `"high"` / `"low"` (low = no photo or vague location) |
| createdAt | Date | |
| updatedAt | Date | |

**Indexes:** `trackingId` (unique), `userId`, `location` (2dsphere geospatial for duplicate detection), `category + createdAt`

### 7. `complaint_status_updates`
Append-only audit log for complaint status changes.

| Field | Type | Notes |
|---|---|---|
| complaintId | ObjectId | Indexed |
| status | string | Matches complaints status enum |
| note | string / null | |
| updatedBy | string / ObjectId | `"system"` or ref → admin_users |
| createdAt | Date | |

**Rule:** Never mutated after insert (append-only).

### 8. `feedback`
Thumbs up/down on AI responses.

| Field | Type | Notes |
|---|---|---|
| messageId | ObjectId | Indexed, unique |
| conversationId | ObjectId | |
| rating | string | `"up"` / `"down"` |
| comment | string / null | |
| createdAt | Date | |

**Indexes:** `messageId` (unique), `createdAt`

### 9. `admin_users`
Internal admin/editor accounts.

| Field | Type | Notes |
|---|---|---|
| email | string | Unique, indexed |
| passwordHash | string | bcrypt, cost factor 12 |
| role | string | `"editor"` / `"admin"` |
| createdAt | Date | |

## Redis Keys (Non-Mongo)

| Key Pattern | Value | TTL |
|---|---|---|
| `otp:{phone}` | `{ hash: string, attempts: number }` | 300s |
| `ratelimit:{ip}:{route}` | counter | 60s |
| `ratelimit:otp:{phone}` | counter (max 3 requests/hour) | 3600s |
| `session:anon:{sessionId}` | conversationId | 86400s |

## Cloudflare R2 (Blob Storage)

- **Bucket:** `smart-bharat-complaints`
- **Path pattern:** `complaints/{trackingId}/{uuid}.jpg`
- **Access:** No public bucket listing. Signed URLs with 24-hour expiry, regenerated per request.

## Relationships

```
users 1──* conversations
users 1──* complaints
conversations 1──* messages
messages 1──? feedback (optional 1:1)
complaints 1──* complaint_status_updates
complaints *──? complaints (duplicateOfComplaintId, self-ref)
admin_users ←── service_catalog.reviewedBy
admin_users ←── complaint_status_updates.updatedBy
```

## Data Retention

- Complaint records + status updates: minimum 2 years (civic accountability)
- Conversations/messages: session-scoped in v1, may expire
- Analytics: anonymized, retained for metrics
- Deprecated KB entries: soft-deleted (`isActive: false`), retained
- Atlas: automated daily backups, 7-day retention minimum
