# COMMON Backend API

> **Share more. Own less. Access together.**

COMMON is a community shared-inventory platform where people in a neighborhood discover and share useful physical resources (tools, ladders, projectors, camping gear, household appliances) that already exist within their neighborhood.

This is the complete, production-ready backend API built with **Hono**, running on **Cloudflare Workers**, backed by **Supabase (PostgreSQL, Auth, Storage)**, and strictly validated with **Zod**.

---

## 🏛️ System Architecture

```text
SvelteKit Frontend
        │
        │ HTTPS REST API (/api/v1)
        ▼
Cloudflare Workers Runtime (Edge)
        │
        ▼
Hono Backend API
        ├── CORS & Centralized Error Handling
        ├── Supabase JWT Bearer Auth Middleware
        ├── Zod Request Validation Middleware
        ├── Domain Controllers (HTTP handling)
        ├── Business Logic & Authorization Services
        │     - Discover -> Request -> Owner Review -> Borrow -> Return
        │     - Overdue Tracking & Anti-Conflict Engine
        │
        ▼
Supabase Infrastructure
        ├── PostgreSQL (Data storage, triggers, indexes, RLS defense-in-depth)
        ├── PostgreSQL RPC Functions (Atomic state transitions)
        ├── Supabase Auth (JWT issuance & user verification)
        └── Supabase Storage (item-images private bucket & access control)
```

---

## 📁 Project Structure

```text
backend/
├── src/
│   ├── index.ts                           # Cloudflare Workers entrypoint
│   ├── app.ts                             # Main Hono app, CORS, error handling & routing
│   ├── routes/
│   │   ├── health.ts                      # GET /health
│   │   ├── auth.ts                        # GET /api/v1/auth/me
│   │   ├── communities.ts                 # /api/v1/communities
│   │   ├── items.ts                       # /api/v1/items
│   │   ├── borrowing-requests.ts          # /api/v1/borrowing-requests (lifecycle)
│   │   └── community-needs.ts             # /api/v1/community-needs
│   ├── controllers/
│   │   ├── communities.controller.ts      # HTTP controller for communities
│   │   ├── items.controller.ts            # HTTP controller for items
│   │   ├── borrowing-requests.controller.ts # HTTP controller for borrowing requests
│   │   └── community-needs.controller.ts  # HTTP controller for community wishlist
│   ├── services/
│   │   ├── communities.service.ts         # Community queries, memberships & checks
│   │   ├── items.service.ts               # Item filtering, CRUD & ownership authorization
│   │   ├── borrowing.service.ts           # Borrowing lifecycle, atomic updates & conflict detection
│   │   └── community-needs.service.ts     # Community needs CRUD & ownership authorization
│   ├── middleware/
│   │   ├── auth.middleware.ts             # Supabase Bearer JWT verification & context attachment
│   │   ├── error.middleware.ts            # Centralized API error response handler
│   │   └── validation.middleware.ts       # Zod body, query, and param validation middleware
│   ├── lib/
│   │   ├── supabase.ts                    # User-scoped & Service-role Supabase client factories
│   │   └── response.ts                    # Standard API response envelopes (success/error)
│   ├── schemas/
│   │   ├── community.schema.ts            # Zod validation schemas for communities
│   │   ├── item.schema.ts                 # Zod validation schemas for items & filters
│   │   ├── borrowing-request.schema.ts    # Zod validation schemas for borrowing requests
│   │   └── community-need.schema.ts       # Zod validation schemas for community needs
│   ├── types/
│   │   ├── index.ts                       # Context types, Bindings, Variables, DTOs
│   │   └── database.types.ts              # Supabase PostgreSQL schema types
│   └── utils/
│       └── errors.ts                      # Custom AppError classes
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql         # Consolidated PostgreSQL schema, triggers, RLS, RPCs
│   ├── seed.sql                           # Seed data for RT 05 Commons demo
│   └── storage.sql                        # Supabase Storage item-images setup
├── package.json                           # Dependencies & scripts
├── tsconfig.json                          # Strict TypeScript configuration
├── wrangler.jsonc                         # Cloudflare Workers configuration
├── .dev.vars.example                      # Environment variables template
├── .gitignore                             # Git ignore rules
└── README.md                              # Complete backend documentation
```

---

## ⚙️ Environment Variables

Copy `.dev.vars.example` to `.dev.vars` for local development:

```env
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
CORS_ORIGIN="http://localhost:5173"
ENVIRONMENT="development"
```

> [!IMPORTANT]
> `SUPABASE_SERVICE_ROLE_KEY` must **never** be exposed to the frontend or checked into version control. On Cloudflare Workers production, set it securely via:
> ```bash
> npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
> ```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Supabase Database
1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and navigate to the **SQL Editor**.
2. Run `supabase/migrations/001_initial_schema.sql` to create all tables, triggers, indexes, RLS policies, and RPC functions.
3. Run `supabase/storage.sql` to configure the `item-images` bucket.
4. Run `supabase/seed.sql` to populate demo data for **RT 05 Commons**.

### 3. Run Locally with Wrangler
```bash
npm run dev
```
The API will be available at `http://localhost:8787`.

### 4. Type Check
```bash
npm run check
```

---

## 📡 REST API Reference

All protected endpoints require the header:
```text
Authorization: Bearer <SUPABASE_JWT_ACCESS_TOKEN>
```

### Response Format
#### Success (200 / 201)
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable confirmation"
}
```

#### Error (4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not allowed to approve this request.",
    "details": []
  }
}
```

---

### 1. Health & Status
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Health check, API version, and timestamp |

---

### 2. User & Auth
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/auth/me` | Required | Returns current user's profile and community memberships |

---

### 3. Communities
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/communities` | Required | List communities the authenticated user belongs to |
| `POST` | `/api/v1/communities` | Required | Create a new community (creator automatically becomes admin) |
| `GET` | `/api/v1/communities/:id` | Required | Get community details (member only) |
| `GET` | `/api/v1/communities/:id/members` | Required | List members of community (member only) |

#### Create Community Body:
```json
{
  "name": "RT 05 Commons",
  "slug": "rt-05-commons",
  "description": "Shared resources for RT 05 warga",
  "location": "Jakarta Selatan"
}
```

---

### 4. Items
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/items` | Required | List items. Supports `?community_id=UUID&category=Tools&status=available&search=drill` |
| `POST` | `/api/v1/items` | Required | Create item in community (owner is automatically caller) |
| `GET` | `/api/v1/items/:id` | Required | Get item details + owner profile + community info |
| `PATCH` | `/api/v1/items/:id` | Required | Update item (only owner) |
| `DELETE` | `/api/v1/items/:id` | Required | Delete item (only owner, blocked if active approved borrows) |

#### Create Item Body:
```json
{
  "community_id": "11111111-1111-1111-1111-111111111111",
  "name": "Bosch Impact Power Drill 650W",
  "description": "Includes masonry and wood drill bits",
  "category": "Tools",
  "condition": "Excellent",
  "location_hint": "Blok B3 No. 7",
  "borrowing_rules": "Please return bits to their designated slots",
  "image_url": "https://example.com/drill.jpg"
}
```

---

### 5. Borrowing Requests & Lifecycle
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/borrowing-requests` | Required | Submit borrowing request for an item |
| `GET` | `/api/v1/borrowing-requests/me` | Required | List requests submitted by authenticated user |
| `GET` | `/api/v1/borrowing-requests/incoming` | Required | List incoming requests for items owned by authenticated user |
| `GET` | `/api/v1/borrowing-requests/:id` | Required | Get request details (requester or owner only) |
| `POST` | `/api/v1/borrowing-requests/:id/approve` | Required | Approve request (only owner). Sets item to `borrowed` |
| `POST` | `/api/v1/borrowing-requests/:id/reject` | Required | Reject request (only owner). Sets request to `rejected` |
| `POST` | `/api/v1/borrowing-requests/:id/cancel` | Required | Cancel request (only requester). Sets request to `cancelled` |
| `POST` | `/api/v1/borrowing-requests/:id/return` | Required | Confirm item returned (borrower or owner). Sets item to `available` |
| `POST` | `/api/v1/borrowing-requests/sync-overdue`| Required | Sync overdue requests past end_date |

#### Submit Request Body:
```json
{
  "item_id": "22222222-2222-2222-2222-000000000001",
  "start_date": "2026-09-10",
  "end_date": "2026-09-12",
  "purpose": "Installing wall shelves in the living room"
}
```

---

### 6. Community Needs (Wishlist)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/community-needs` | Required | List needs in user's communities (`?community_id=UUID&status=open`) |
| `POST` | `/api/v1/community-needs` | Required | Post a community need |
| `PATCH` | `/api/v1/community-needs/:id` | Required | Update community need (creator only) |
| `DELETE` | `/api/v1/community-needs/:id` | Required | Delete community need (creator only) |

#### Post Need Body:
```json
{
  "community_id": "11111111-1111-1111-1111-111111111111",
  "title": "Need leaf blower for Sunday community cleanup",
  "description": "Looking for electric or battery-powered leaf blower to clean public park",
  "needed_from": "2026-09-14",
  "needed_until": "2026-09-15"
}
```

---

## 🔒 Verification of Required Test Scenarios

| Scenario | Workflow | Backend Behavior & Status Code |
| :--- | :--- | :--- |
| **Scenario 1: Normal Borrowing** | User A owns drill. User B requests drill. User A approves. User B returns drill. | `POST /borrowing-requests` -> 201 (`status: 'pending'`).<br>`POST /approve` -> 200 (`status: 'approved'`, item `borrowed`).<br>`POST /return` -> 200 (`status: 'returned'`, item `available`). |
| **Scenario 2: Unauthorized Approval** | User C (not owner) attempts to approve User B's request. | `403 Forbidden` (`Only the owner of this item can approve borrowing requests`). |
| **Scenario 3: Request Own Item** | Owner attempts to create a request for their own item. | `400 Bad Request` (`You cannot request to borrow an item you own`). |
| **Scenario 4: Invalid Dates** | User submits request where `start_date > end_date`. | `422 Unprocessable Entity` (`start_date must be before or equal to end_date`). |
| **Scenario 5: Unauthorized Community Access** | User is not a member of the item's community. | `403 Forbidden` (`You must be a member of the community sharing this item`). |
| **Scenario 6: Return** | Item is approved/overdue, caller returns item. | `POST /return` -> 200 (`status: 'returned'`, item restored to `available`). |

---

## ⏰ Overdue Detection & Scheduled Maintenance

An approved borrowing request becomes **overdue** when:
```text
CURRENT_DATE > end_date AND returned_at IS NULL
```

In the backend:
1. `BorrowingService.syncOverdueRequests(supabaseAdmin)` performs the bulk update.
2. Endpoint `POST /api/v1/borrowing-requests/sync-overdue` can be triggered manually or called by an external service.
3. For Cloudflare Workers automation, configure a Cron Trigger in `wrangler.jsonc`:
   ```jsonc
   "triggers": {
     "crons": ["0 0 * * *"] // Runs daily at midnight UTC
   }
   ```
   and attach a `scheduled` handler in `src/index.ts`.

---

## 🚢 Deployment to Cloudflare Workers

1. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```
2. Store your production Supabase Service Role Key as a secret:
   ```bash
   npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   ```
3. Set your production environment variables in `wrangler.jsonc` or via dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `CORS_ORIGIN` (your production SvelteKit URL)
4. Deploy:
   ```bash
   npm run deploy
   ```
