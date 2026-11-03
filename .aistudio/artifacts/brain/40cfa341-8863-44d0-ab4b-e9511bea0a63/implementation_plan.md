# LPUmart — Full-Stack Campus Marketplace Implementation Plan

> **Goal**: Turn the existing LPUmart prototype into a secure, production-grade full-stack campus marketplace by implementing a robust Node.js/Express backend, Supabase PostgreSQL schema with RLS, institutional student authentication, persistent notifications, and atomic cryptographic escrow handshakes while preserving the existing React 19 + Vite frontend and cyberpunk UI design.

---

### User Review & Confirmed Architectural Choices

> [!IMPORTANT]
> The following design and implementation choices were confirmed during Phase 1:

- **Supabase Integration & Persistence**: Supabase PostgreSQL and Supabase Auth with strict environment validation, comprehensive SQL migrations, and robust server-side API endpoints.
- **Authentication & Campus Identity**: Interactive Auth Modal supporting student registration, login, institutional `@lpu.in` verification, profile management, and quick student profile switching for demo testing.
- **Real-Time Updates & Notifications**: Real-time order state updates, handover alerts, and persistent notification center.
- **Backend-Authoritative Governance**: All role checks, financial calculations (paise precision), token validation, and dispute settlements execute on the server, not in the browser.

---

## 1. Overview & Core Concept

**LPUmart** is a hyper-localized student marketplace for Lovely Professional University. Students can buy, sell, and rent laptops, smartphones, engineering textbooks, hostel furniture, and electronics. The platform combines:
1. **Governed AI Agent Ecosystem**: 3-layer defensive intermediate assistant (Layer 1 deterministic PII deflection, Layer 2 zero-trust database isolation, Layer 3 Gemini 3.8 Flash model guardrails) with ₹5 session billing.
2. **Dual-Token Campus Handshake**: Cryptographic SHA-256 tokens with single-use replay protection and 100m GPS geofencing around approved campus checkpoints (Uni-Mall, Block 34, Library, BH4, GH2).
3. **Double-Entry Financial Ledger**: 10% platform safety commission and ₹2 immutable social allocation to Vridh Ashram per completed deal.
4. **Institutional Verification & Admin Governance**: Role-based access control, dispute arbitration console, and threat audit telemetry.

---

## 2. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React 19 Frontend (Vite)                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Marketplace  │ │ AI Assistant │ │ Security Lab │ │ Escrow Hand- │   │
│  │ Catalog/PDP  │ │ Modal (₹5)   │ │ (8 Scenarios)│ │ shake (QR)   │   │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘   │
│         │                │                │                │           │
│  ┌──────┴────────────────┴────────────────┴────────────────┴───────┐   │
│  │ Auth Modal · Notification Center · MarketplaceContext Provider  │   │
│  └──────────────────────────────┬──────────────────────────────────┘   │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │ HTTP / SSE / REST (/api/*)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Node.js / Express Server (server.ts)               │
│                                                                        │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌──────────────┐  │
│  │ Auth & RLS Middleware │ │ Input Deflection (L1) │ │ Rate Limiter │  │
│  └──────────┬────────────┘ └──────────┬────────────┘ └──────┬───────┘  │
│             │                         │                     │          │
│  ┌──────────▼─────────────────────────▼─────────────────────▼───────┐  │
│  │ Express Route Controllers:                                       │  │
│  │ • /api/auth (Register, Login, Session, Verify Student)           │  │
│  │ • /api/listings (CRUD, Search, Categories, Condition, Favourites)│  │
│  │ • /api/orders (Create, Accept, Cancel, Status Transition)        │  │
│  │ • /api/handshake (Cryptographic Token Gen, Atomic Replay Guard)  │  │
│  │ • /api/escrow (Double-Entry Ledger, Vridh Ashram Fund, Disputes) │  │
│  │ • /api/ai/chat & /api/ai/stream (Gemini 3.8 Flash Server Proxy)  │  │
│  │ • /api/notifications (Read/Unread, Order Events)                 │  │
│  │ • /api/admin (Metrics, User Moderation, Dispute Arbitration)     │  │
│  └────────────────────────────────────┬─────────────────────────────┘  │
└───────────────────────────────────────┼────────────────────────────────┘
                                        │ Server-Side Service Role / REST
                                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Supabase PostgreSQL & Storage Layer                  │
│                                                                        │
│  • 24 Relational Tables (profiles, listings, orders, escrow, audit)    │
│  • Row-Level Security (RLS) Policies on every table                   │
│  • Atomic Handshake Token State Updates                                │
│  • Immutable Vridh Ashram Social Ledger & Audit Logs                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Implementation Phases & Key Milestones

### Phase 1: Database Migrations & Supabase Architecture
- Author comprehensive SQL migrations (`supabase/migrations/20261103000001_initial_schema.sql`):
  - Normalized schemas for `profiles`, `student_verifications`, `categories`, `listings`, `orders`, `escrow_accounts`, `escrow_transactions`, `commission_records`, `donation_ledger`, `transaction_tokens`, `dispute_records`, `notifications`, `audit_logs`.
  - Comprehensive Row-Level Security (RLS) policies:
    - Users can read public listings and update only their own listings.
    - Buyers & sellers can view only their respective orders.
    - Financial ledger and transaction token updates restricted to server-side service role.
    - Admin-only routes validated through verified role checks.
- Create Supabase client utility (`src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`).

### Phase 2: Express Backend Foundation & API Routes
- Implement complete Express API route handlers in `server.ts` (or modular route controllers):
  - `/api/auth`: Student registration with `@lpu.in` domain check, password login, session verification, logout, student verification state (`UNVERIFIED`, `PENDING`, `VERIFIED`, `REJECTED`).
  - `/api/listings`: Browse with category/condition/price filters, search, create, update, delete, toggle favourite.
  - `/api/orders`: Order placement, rental duration calculation, seller acceptance, cancellation.
  - `/api/handshake`: Cryptographic dual-token generation (SHA-256 hash), atomic token validation, 100m geofence verification, single-use replay protection.
  - `/api/escrow`: Double-entry transaction ledger (paise precision), 10% platform commission, ₹2 Vridh Ashram donation allocation, dispute creation, admin arbitration.
  - `/api/notifications`: Persistent user notifications for order milestones.
  - `/api/admin`: Governance KPI counters, user verification approvals, threat audit stream.
  - `/api/health`: Health-check and configuration status endpoint.

### Phase 3: Client-Side State & Context Integration
- Update `MarketplaceContext.tsx` to communicate with backend `/api/*` endpoints.
- Integrate real token storage and user authentication state.
- Implement an interactive **Auth & Student Verification Modal** (`AuthModal.tsx`) with registration, login, and quick-profile switching for evaluator convenience.
- Add a **Notification Drawer / Popover** in `Navbar.tsx` displaying real-time order alerts.

### Phase 4: Dispute & Handover Management Polish
- Wire real dispute submission with evidence description.
- Implement admin arbitration actions (Refund Buyer vs Release to Seller) that atomically update escrow states.
- Ensure all QR handshake scanning and GPS checks communicate with `/api/handshake/verify`.

### Phase 5: Verification & Automated Test Suite
- Expand `tests/security-acceptance.test.ts` to test:
  1. Student registration & unauthorized admin escalation prevention.
  2. Listing creation & backend price validation.
  3. Layer 1 PII sanitization and Layer 3 Gemini server proxy.
  4. Dual-token QR handshake single-use and replay rejection.
  5. Geofence distance calculation (<100m).
  6. Double-entry escrow financial math (10% commission + ₹2 charity).
- Run `compile_applet`, `lint_applet`, and the test suite to ensure 100% passing status.
