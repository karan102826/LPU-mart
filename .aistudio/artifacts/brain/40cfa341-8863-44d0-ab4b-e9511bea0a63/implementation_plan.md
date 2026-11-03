# LPUmart — Governed AI Agent Ecosystem

> **Tagline**: Buy. Sell. Rent. Right on campus.  
> An enterprise-grade governed campus marketplace and AI security demonstration platform designed exclusively for the Lovely Professional University (LPU) student community.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and interactive preferences have been confirmed for the live preview and hackathon evaluation:

- **AI Provider Strategy**: Built on a unified provider abstraction layer with live Google Gemini API execution in the AI Studio environment alongside mockable/configurable OpenAI and Anthropic provider interfaces.
- **AI Security Lab ("Break The Agent")**: Featured as a primary top-level navigation tab with 8 automated test scenarios, live custom prompt injection test bench, and step-by-step deflection pipeline visualization (Input → Deterministic Inspection → Redacted Message → LLM Execution Gate → Security Audit Log).
- **Campus Escrow & Handshake Protocol**: Demonstrated with an interactive Campus Handshake Simulator featuring authentic LPU meeting zones (Uni-Mall, Block 34, Central Library, Boys Hostel 4, Girls Hostel 2), dual-token cryptographically signed QR code rendering, and real-time GPS 100m proximity verification.
- **Architectural Documentation**: Complete `TECHNICAL_DECISIONS.md` file maintained in the repository root documenting the server-side architecture, Supabase schema definitions, rate limiting, and Next.js / Express parity.

---

## 1. Overview & Core Concept

**LPUmart** is a hyper-localized student marketplace and a real-world sandbox for a **Governed AI Agent Ecosystem**. The platform enables verified LPU students to buy, sell, and rent laptops, smartphones, engineering textbooks, lab coats, hostel furniture, gaming gear, and campus essentials.

### The Core Philosophy
> *"AI should have the intelligence to assist users, but never the unrestricted authority to compromise user privacy, financial integrity, or platform governance."*

### Key Innovations
1. **Governed AI Agent Intermediary**: Natural-language product discovery and inquiry with 3 strict defense layers: Deterministic Regex/NER Input Deflection (blocking phone numbers, emails, UPI VPAs, and registration numbers), Zero-Trust Database Isolation (only public listing attributes reachable), and Backend Policy Guardrails.
2. **Transparent AI Session Fee**: Transparent ₹5 per item-query engagement fee with explicit confirmation dialogs, idempotency protection, and auditable customer billing history.
3. **Smart Campus Handshake & Escrow**: Dual-token QR exchange with server-side SHA-256 hash validation, campus coordinate geofencing (100m radius), and single-use replay protection.
4. **Vridh Ashram Social Allocation**: Immutable ₹2 charitable allocation recorded on every completed campus sale with real-time community impact tracking.
5. **Interactive AI Security Lab**: A dedicated test bench for judges and security auditors to execute live attacks (PII extraction, prompt injection, off-platform payment attempts, QR replay) and observe real-time defense layers in action.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Aesthetic Direction**: High-end cyberpunk-inspired campus technology startup. Clean, dark, matte surfaces with high-visibility electric orange and amber accents.
- **Color Palette (60-30-10 discipline)**:
  - *Dominant Neutral (60%)*: Pure black (`#000000`) and deep matte background (`#09090B`).
  - *Structural Surfaces (30%)*: Elevated card surfaces (`#111114`), hairline zinc borders (`#27272A`), soft charcoal overlays, and secondary text (`#A1A1AA`).
  - *Accent Budget (10%)*: Electric orange (`#FF6B00`) for primary actions, amber (`#FF9F43`) for highlights, and emerald (`#10B981`) for verified badges.
- **Typography**: Clean display font paired with high-legibility geometric sans (`Plus Jakarta Sans`), tabular figures (`tabular-nums`) for currency and transaction hashes, and strict unboxed metadata (`·` typographic separators, zero-pill discipline).
- **Navigation (Mobile & Desktop)**:
  - *Desktop*: Strict 1-row, 3-zone top bar contract (Brand Wordmark, 5 clean navigation links: *Marketplace*, *AI Assistant*, *Security Lab*, *Escrow & Handshake*, *Admin*, and 1 primary Action CTA).
  - *Mobile*: Compact sticky header + 5-tab ergonomic bottom navigation bar (`<15%` sticky viewport cap).

### Key User Flows
1. **Marketplace Discovery & Filtering**: Search products by keyword, category (Laptops, Textbooks, Electronics, Furniture, etc.), transaction type (*Buy* vs *Rent*), condition, and price sort with instant client-side filtering and contiguous product detail drawers.
2. **AI Shopping Assistant with ₹5 Fee Guard**: Customer clicks "Ask LPU AI" on a listing; receives an upfront ₹5 engagement fee disclosure; upon accepting, a session is initialized, sanitizing inquiries and providing grounded product advice while blocking any shared phone/UPI details.
3. **Order Placement & Dual-Token Escrow Handshake**: Buyer initiates purchase or rental; order enters escrow; seller accepts and generates a one-time cryptographic buyer QR code; both parties open the Handshake screen at a designated campus hotspot (e.g., Uni-Mall); GPS confirms mutual proximity (<100m); scanning validates tokens atomically and finalizes payment.
4. **Break-The-Agent Security Lab**: Live sandbox with one-click test suites executing real attacks against the deterministic filter and AI backend, displaying input, masked payload, LLM gate status, and generated audit events.
5. **Administrator Governance Center**: Real-time KPI counters (Marketplace Volume, 10% Platform Commission, Vridh Ashram Fund, AI Engagement Fees, Blocked PII Incidents, Active Disputes) with student verification and dispute resolution workflows.

---

## 3. Key Product Decisions & Trade-Offs

- **Multi-Provider AI Architecture**:
  - *Decision*: Native integration with Google Gemini via `@google/genai` (leveraging AI Studio environment credentials) combined with an abstract provider interface (`AIProvider` interface) supporting OpenAI and Anthropic.
  - *Why*: Delivers guaranteed live execution in the preview environment while preserving production parity with OpenAI / Anthropic configurations.
- **Layer 1 Deterministic Deflection Before LLM**:
  - *Decision*: Hard regex-based pattern matchers for Indian phone numbers (`+91`, 10-digit mobile), email addresses, UPI VPAs (`@okhdfcbank`, `@paytm`, etc.), and LPU registration numbers (`118...`, `12...`) that mask content into `"Contact details are protected by LPUmart."` before sending payload to the AI model.
  - *Why*: Eliminates hallucination risks and prompt injection bypasses. If the LLM never sees the raw PII, it is physically incapable of leaking it.
- **Simulated Escrow Ledger with Authoritative State Machine**:
  - *Decision*: Authoritative server-side ledger with strict state transitions (`PENDING` → `SELLER_ACCEPTED` → `HANDSHAKE_READY` → `COMPLETED` or `DISPUTED`).
  - *Why*: Avoids unlawful custody of real funds while demonstrating mathematically complete double-entry bookkeeping, 10% platform commission cuts, and ₹2 charity allocations.
- **Interactive GPS Campus Hotspot Simulator**:
  - *Decision*: Support real device `navigator.geolocation` paired with an interactive campus hotspot simulator allowing judges to test matching locations (within 100m of Uni-Mall) vs out-of-range scenarios.
  - *Why*: Evaluators testing on desktop browsers or outside LPU campus grounds can seamlessly test the 100m proximity lock.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                         LPUmart Client (React 19)                      │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────┐  │
│  │ Marketplace │ │ Governed AI  │ │ Security Lab │ │ Escrow Hand-   │  │
│  │ & Discovery │ │ Assistant    │ │ (Break Agent)│ │ shake (QR+GPS) │  │
│  └──────┬──────┘ └──────┬───────┘ └──────┬───────┘ └───────┬────────┘  │
└─────────┼───────────────┼────────────────┼─────────────────┼───────────┘
          │               │                │                 │
          ▼               ▼                ▼                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Server API Layer & Security Middleware               │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Layer 1: Deterministic Input Inspection & PII Deflection Engine  │  │
│  │ (Regex / Pattern Sanitizer: Phone, Email, UPI VPA, RegNo)       │  │
│  └──────────────────────────────┬───────────────────────────────────┘  │
│                                 ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Layer 2: Zero-Trust Database Isolation & Allowlisted Attributes  │  │
│  │ (Only Public Listing Fields Exposed; Auth & Profiles Isolated)   │  │
│  └──────────────────────────────┬───────────────────────────────────┘  │
│                                 ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Layer 3: Governed AI Provider Abstraction (Gemini / OpenAI / Anth)│  │
│  │ System Instruction Guardrails & Anti-Prompt-Injection Boundary   │  │
│  └──────────────────────────────┬───────────────────────────────────┘  │
│                                 │                                      │
│  ┌──────────────────────────────┴───────────────────────────────────┐  │
│  │ Escrow Engine, Cryptographic Dual-Token QR & Location Handshake  │  │
│  └──────────────────────────────┬───────────────────────────────────┘  │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Data & Audit Persistence                        │
│  ┌───────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ Profiles &    │ │ Listings &   │ │ Orders &     │ │ Financial    │  │
│  │ Student IDs   │ │ Categories   │ │ Dual Tokens  │ │ Escrow Ledger│  │
│  └───────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  │
│  ┌───────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ AI Sessions & │ │ Audit Logs & │ │ Vridh Ashram │ │ Rate Limiter │  │
│  │ ₹5 Fee Ledger │ │ Threat Intel │ │ Charity Fund │ │ Storage      │  │
│  └───────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & State Architecture
1. **Listings & Categories**: Catalog with rich attributes (condition, selling price, daily rental rate, security deposit, availability status, seller verified tag, high-res photos).
2. **Governed AI Sessions**: Session records tracking customer ID, target listing, cumulative ₹5 fee status, message history with before/after redaction snapshots, and deflection counters.
3. **Escrow Transactions & Tokens**: Dual tokens (Buyer Token, Seller Token) hashed with SHA-256 with 15-minute TTL, linked to designated campus meeting coordinates.
4. **Double-Entry Financial Ledger**:
   - `selling_price` (Gross)
   - `platform_commission` (10%)
   - `seller_payout` (90% - Charity)
   - `charity_vridh_ashram` (₹2 flat per completed deal)
   - `ai_engagement_fee` (₹5 recorded per session)
5. **Threat Intelligence & Audit Log**: Immutable record of sanitization events, blocked PII payloads (without storing raw PII), prompt injection flags, and unauthorized settlement attempts.

---

## 5. Implementation Sequence & Next Steps

1. **Step 1: Core Foundation & Technical Decisions**:
   - Create `TECHNICAL_DECISIONS.md` documenting architecture mappings, Supabase schema definitions, and security policies.
   - Configure global cyberpunk theme tokens, typography, and viewport structure.
2. **Step 2: Server API & Security Engine**:
   - Implement Layer 1 Input Deflection engine (regex & heuristics for phone, email, UPI, reg numbers).
   - Implement Layer 2 Zero-Trust query projection.
   - Implement Layer 3 AI Provider abstraction with live Gemini integration and prompt guardrails.
   - Implement cryptographic dual-token generation and validation.
3. **Step 3: Marketplace & Discovery**:
   - Seed rich catalog of campus listings across Electronics, Laptops, Textbooks, Furniture, and Gaming.
   - Build product grid, dynamic category filtering, rental/buy mode switches, search, and detail modal.
4. **Step 4: Governed AI Intermediary & ₹5 Fee Flow**:
   - Build slide-out AI Assistant with upfront ₹5 session confirmation, real-time sanitization indicators, and contextual product recommendations.
5. **Step 5: Campus Escrow & Handshake Protocol**:
   - Build dual-token QR code generator and Handshake verification interface with campus map and GPS proximity validator (<100m).
6. **Step 6: Break-The-Agent AI Security Lab**:
   - Implement interactive attack test bench with 8 preconfigured exploit scenarios and custom attack runner.
7. **Step 7: Administrator & Social Impact Dashboard**:
   - Build analytics counters, Vridh Ashram donation reconciliation ledger, dispute arbitrator, and threat log explorer.
8. **Step 8: Verification & Quality Assurance**:
   - Run compilation and tests across all modules to verify error-free execution.
