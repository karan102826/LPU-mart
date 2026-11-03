# LPUmart — Technical Architecture & Decisions Document

## 1. System Overview
**LPUmart** is a production-grade full-stack campus marketplace and AI governance sandbox built specifically for Lovely Professional University (LPU). Its flagship capability is a 3-layer Governed AI Agent ecosystem ensuring AI operates as an intelligent interface without the authority to breach student privacy or execute unverified financial operations.

## 2. Architecture & Runtime Decisions

### 2.1 Framework & Runtime Environment
- **Client & Frontend**: React 19 SPA running with Vite & Tailwind CSS v4. Designed with modular App Router component architecture mirroring Next.js conventions (`/app`, `/lib`, `/services`, `/components`).
- **Server Infrastructure**: Full-stack Node.js server with Express proxy mounting Vite middlewares during development and serving production assets on port 3000.
- **Next.js Parity**: All business logic, input sanitizers, token generators, and provider abstractions are structured in cleanly decoupled TypeScript modules (`lib/`, `services/`) with identical signatures to Next.js Route Handlers and Server Actions.

### 2.2 Database & Row Level Security (Supabase PostgreSQL)
- **Supabase PostgreSQL Schema**: Complete relational schema defined with 24 authoritative tables:
  - `profiles`, `student_verifications`, `listings`, `listing_images`, `categories`, `favourites`
  - `orders`, `order_items`, `rental_requests`
  - `ai_sessions`, `ai_messages`, `ai_fee_records`
  - `escrow_accounts`, `escrow_transactions`, `commission_records`, `seller_ledger`, `customer_ledger`
  - `dispute_records`, `refund_records`, `campus_locations`, `transaction_tokens`, `donation_ledger`
  - `notifications`, `audit_logs`, `admin_settings`
- **Zero-Trust Projection (Layer 2)**: The AI retrieval client has zero access to private user records (phone numbers, emails, passwords, student registration IDs, private ledger lines). Only allowlisted public listing attributes are projected into AI contexts.
- **Row-Level Security (RLS)**: Enforced via `auth.uid()` checks in database policies. Users can only edit their own listings and view their own orders; only trusted server processes can mutate transaction states and financial balances.

### 2.3 Governed AI Agent Ecosystem (The 3 Defensive Layers)
- **Layer 1: Input Deflection (Deterministic Backend Security)**
  - Hard regex and pattern matchers run before any payload touches an external LLM.
  - Automatically deflects and redacts:
    - Indian Mobile numbers (10 digits, +91, 0 prefixes, spaced variations)
    - Email addresses (`*@*.*`, including `@lpu.in`, `@lpu.co.in`, `@gmail.com`)
    - LPU Student Registration Numbers (8-digit patterns like `11802914`, `12104892`)
    - UPI IDs / VPAs (`*@upi`, `@okhdfcbank`, `@paytm`, `@ybl`, etc.)
    - Social handles (Instagram `@...`, Snapchat, Telegram)
  - Redaction string: `"Contact details are protected by LPUmart."`
  - PII is never logged in server traces or sent to AI providers.
- **Layer 2: Complete Database Isolation**
  - AI tools can only query public marketplace columns: `title`, `description`, `price`, `rental_rate`, `category`, `condition`, `availability`.
  - Service-role credentials and internal schemas are blocked from runtime context.
- **Layer 3: Provider Abstraction & Guardrails**
  - Unified `AIProvider` interface supporting Google Gemini (live execution via `@google/genai`), OpenAI, and Anthropic.
  - System instruction guardrails strictly prohibit price negotiation, off-platform settlement, system prompt disclosure, or unauthorized role escalation.

### 2.4 AI Engagement Billing
- Flat ₹5 fee per item-query session.
- Users are presented with an explicit fee consent screen before opening a session.
- Idempotency key tracking prevents duplicate charges on re-entry.

### 2.5 Campus Escrow & Smart-Verification Lock
- **Dual-Token Cryptographic Handshake**:
  - SHA-256 hashed transaction tokens generated upon seller acceptance (Buyer Token & Seller Token).
  - Short-lived TTL (15 minutes) with single-use atomic consumption and replay prevention.
- **Geofenced Campus Verification**:
  - Verified against administrator-approved LPU hotspots (Uni-Mall, Block 34, Central Library, BH4, GH2).
  - Enforces mutual 100-meter proximity radius with fallback for controlled verification.
- **Double-Entry Financial Distribution**:
  - Item Selling Price
  - 10% Platform Commission
  - ₹2 Vridh Ashram Social Allocation (immutable ledger entry)
  - 90% (- ₹2) Seller Payable Net

### 2.6 Rate Limiting & Denial of Service Protection
- Upstash Redis sliding window interface implemented for production scalability.
- Standard limits: AI requests (20/min/user), Marketplace API (60/min/user), OTP/QR verification (strict threshold).
- Request timeout protections: 10s for transactional endpoints, 25s for AI orchestration with AbortController signal handling.
