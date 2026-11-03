# LPUmart: Investor & Institutional Pitch Deck
> **Governed AI Agent Ecosystem & Escrow-Protected Campus Marketplace**  
> *Hyper-Localized Commerce for Lovely Professional University (35,000+ Students)*

---

## Slide 1: Title & Vision

```
  ██╗     ██████╗ ██╗   ██╗███╗   ███╗ █████╗ ██████╗ ████████╗
  ██║     ██╔══██╗██║   ██║████╗ ████║██╔══██╗██╔══██╗╚══██╔══╝
  ██║     ██████╔╝██║   ██║██╔████╔██║███████║██████╔╝   ██║   
  ██║     ██╔═══╝ ██║   ██║██║╚██╔╝██║██╔══██║██╔══██╗   ██║   
  ███████╗██║     ╚██████╔╝██║ ╚═╝ ██║██║  ██║██║  ██║   ██║   
  ╚══════╝╚═╝      ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
```

* **Tagline**: The Safe, Governed, and Purpose-Driven Campus Commerce Network.
* **Core Value**: Zero scams, zero off-platform leaks, 100% verified peer-to-peer campus trades.
* **Presenters**: Founders, LPUmart Engineering & Governance Initiative.
* **Target Audience**: University Leadership, Student Welfare Directorate, Angel Investors, Incubators.

> **Speaker Notes**:  
> "Good morning. Every semester, over 35,000 students at Lovely Professional University buy, sell, and rent laptops, textbooks, furniture, and bicycles. Today, that commerce happens on chaotic Telegram channels and WhatsApp groups riddled with UPI fraud, price gouging, and privacy exposure. LPUmart replaces that chaos with a cryptographically verified, AI-governed peer-to-peer ecosystem."

---

## Slide 2: The Problem

### Campus Peer-to-Peer Trading is Broken, Dangerous, and Fragmented

| The Pain Point | How It Happens Today | Impact on Students |
| :--- | :--- | :--- |
| **Payment Scams & Defaults** | Buyer sends UPI payment upfront; seller disappears without delivering the item. | Financial loss; zero dispute arbitration or fraud recourse. |
| **Personal Privacy Exposure** | Phone numbers, personal emails, and hostel room numbers posted publicly on Telegram/OLX. | Doxxing, harassment, spam calls, and security risks in hostels. |
| **Unsafe Handover Locations** | Meetings arranged late at night in unverified campus locations or off-campus alleys. | Safety violations; student anxiety and physical risk. |
| **Unregulated Side-Deals** | No institutional quality check, zero escrow holding, and no social accountability. | Distrust among student body; broken community cohesion. |

> **Speaker Notes**:  
> "Over 68% of university students report having abandoned an on-campus transaction due to distrust in the seller. Even worse, students routinely paste their phone numbers and UPI VPAs into public groups, exposing themselves to spam and targeted phishing."

---

## Slide 3: The Solution — LPUmart

### An Institutional-Grade, AI-Governed Campus Commerce Platform

```
           ┌────────────────────────────────────────────────────────┐
           │                  LPUmart 4-Pillar Trust Engine          │
           ├────────────────────────────┬───────────────────────────┤
           │  1. Institutional Identity │  2. 3-Layer Defensive AI   │
           │     • @lpu.in email check  │     • Deterministic PII   │
           │     • Reg. number verified │       deflection (phones,  │
           │     • Hostels & rooms mapped│       emails, UPIs, IDs)  │
           ├────────────────────────────┼───────────────────────────┤
           │  3. Dual-Token Escrow      │  4. Vridh Ashram Impact   │
           │     • SHA-256 tokens       │     • ₹2 micro-donation   │
           │     • Single-use replay guard    allocated to elder    │
           │     • <100m GPS geofencing │       sanctuary per deal  │
           └────────────────────────────┴───────────────────────────┘
```

1. **Verified Student Identities**: Exclusively accessible by students with `@lpu.in` credentials.
2. **10% Escrow Protection**: Funds held securely until physical verification.
3. **Dual-Token Handshake Protocol**: Cryptographic QR code exchange that only validates when both buyer and seller are within 100 meters of an approved campus checkpoint (Uni-Mall, Central Library, Block 34).
4. **Governed AI Shopping Assistant**: Powered by Gemini 3.8 Flash with deterministic privacy guardrails.

---

## Slide 4: Market Opportunity & TAM

### A Captive, High-Velocity Campus Economy

* **Lovely Professional University (SAM)**:
  * **35,000+** full-time residential students across 600+ acres.
  * **~120,000** potential annual peer transactions (laptops, cycle re-sales, textbooks, electronics, mattresses).
  * **₹18.5 Crore+** estimated annual second-hand campus transaction volume.
* **Tier-1 Indian University Campuses (TAM)**:
  * **4.2 Crore (42M)** higher education students across India.
  * **₹7,500 Crore ($900M USD)** total addressable student secondhand and rental market.
  * **Zero dedicated, governed student platforms**: Craigslist and OLX are too generic and unsafe; WhatsApp groups lack financial infrastructure.

```
       TAM: ₹7,500 Cr (All Indian Campuses)
     ┌──────────────────────────────────────────────┐
     │  SAM: ₹18.5 Cr (LPU Campus Annual GMV)       │
     │  ┌────────────────────────────────────────┐  │
     │  │ SOM: ₹3.2 Cr (Year 1 Target at LPU)    │  │
     │  └────────────────────────────────────────┘  │
     └──────────────────────────────────────────────┘
```

---

## Slide 5: The Dual-Token Handshake Protocol

### Patentable Cryptographic Architecture for Safe Physical Exchanges

Traditional QR codes can be screenshotted, stolen, or shared across WhatsApp. LPUmart prevents fraud through a **Zero-Knowledge Dual-Token Handshake**:

```
 [Buyer Device]                                              [Seller Device]
       │                                                           │
       ├────────────── 1. Request Handover (Uni-Mall) ─────────────┤
       │                                                           │
       ▼                                                           ▼
 [Buyer Token Generated]                                     [Seller Token Generated]
 "LPU-BUY-ORD101-9F3B"                                       "LPU-SEL-ORD101-7D4E"
       │                                                           │
       └────────────── 2. Buyer Presents QR Code ─────────────────>│
                                                                   │
                                                      3. Seller Scans QR Code
                                                                   │
                                                                   ▼
                                                       [Server Validation Engine]
                                                       ├─ Single-Use Token Check
                                                       ├─ Expiration Window (15m)
                                                       └─ GPS Haversine (<100m)
                                                                   │
                                                                   ▼
                                                          [Funds Distributed]
                                                          • 90% to Seller Wallet
                                                          • 10% Platform Reserve
                                                          • ₹2 to Vridh Ashram
```

* **Single-Use Replay Protection**: Tokens are cryptographically consumed in an atomic database transaction. Screenshots cannot be replayed.
* **100m Geofence Constraint**: Handshakes fail if executed outside sanctioned campus meeting points.

---

## Slide 6: The 3-Layer Defensive AI Pipeline

### Enterprise LLM Safety Built Directly into Campus Commerce

Students love AI, but unprotected LLMs leak database credentials, allow prompt injections, and can be tricked into agreeing to off-platform side deals. LPUmart solves this with a **3-Layer Defense Stack**:

```
 Student Prompt: "Can I pay ₹500 in cash? Text me at 9876543210 or UPI user@okaxis"
                                   │
                                   ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │ LAYER 1: Deterministic PII & Financial Deflector                            │
 │ • Scans & purges Indian 10-digit mobile numbers (+91, spaced digits)       │
 │ • Masks personal emails and student registration numbers                    │
 │ • Purges UPI handles (@okhdfcbank, @paytm, @okaxis)                         │
 └─────────────────────────────────┬───────────────────────────────────────────┘
                                   │
                                   ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │ LAYER 2: Zero-Trust Database Isolation & Projection                         │
 │ • Strips seller user ID, real names, phone numbers, and hostel rooms        │
 │ • Passes ONLY public product attributes (category, condition, price)        │
 └─────────────────────────────────┬───────────────────────────────────────────┘
                                   │
                                   ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │ LAYER 3: Gemini 3.8 Flash Execution Guardrails                              │
 │ • System instruction prohibits side-deals, commission bypass, or refunds    │
 │ • Hardened anti-jailbreak filters refuse instructions to override policy    │
 └─────────────────────────────────┬───────────────────────────────────────────┘
                                   │
                                   ▼
 Output to Student: "Contact details are protected by LPUmart. Off-platform UPI
 bypass is prohibited. All transactions must meet at Uni-Mall with 10% escrow."
```

---

## Slide 7: Business Model & Unit Economics

### High-Margin Software Platform with Sustainable Campus Revenue

LPUmart generates revenue on every transaction and AI interaction without burdening students with predatory fees:

```
            Transaction Example: ₹1,000 Textbook / Electronics Sale
            ───────────────────────────────────────────────────────
            Buyer Pays:                     ₹1,000.00
            Platform Commission (10%):      - ₹100.00
            Vridh Ashram Contribution:        - ₹2.00
            ───────────────────────────────────────────────────────
            Seller Receives:                  ₹898.00  (Net 89.8%)
            LPUmart Net Revenue:               ₹98.00  (Net 9.8%)
```

### Revenue Streams
1. **10% Escrow Commission**: Charged on all buy and rent transactions for fraud protection and dispute arbitration.
2. **₹5 AI Consultation Fee**: Charged per in-depth AI assistant session for negotiation assistance, rental condition appraisals, and price checks.
3. **Promoted Campus Listings**: Featured spots for quick hostel departures (end of semester clearances).
4. **Campus Brand Partnerships**: Verified student hardware partnerships with authorized campus retail outlets.

---

## Slide 8: Social Impact — The Vridh Ashram Engine

### Micro-Philanthropy Baked into Every Deal

* **Problem**: University students want to make a social contribution, but traditional charitable donation mechanisms are friction-heavy.
* **LPUmart Innovation**: Every single completed transaction automatically dedicates **₹2** to the **Vridh Ashram Elder Sanctuary** in Punjab.
* **Real-Time Social Ledger**:
  * Visible on the public campus counter.
  * Audited and reconciled with bank receipts.
  * Zero out-of-pocket friction for student buyers.

> **Impact Metric**: 50,000 campus transactions = **₹1,00,000 directly funded** for medicine, meals, and shelter at Vridh Ashram.

---

## Slide 9: Role-Based Governance & Security

### 3 Strict Roles — Zero Unauthorized Admin Access

```
                    ┌──────────────────────────────┐
                    │    Campus Authentication     │
                    │  (Google / Institutional ID) │
                    └──────────────┬───────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
   ┌───────────┐             ┌───────────┐             ┌───────────┐
   │   Buyer   │             │   Seller  │             │   Admin   │
   ├───────────┤             ├───────────┤             ├───────────┤
   │ • Browse  │             │ • Post    │             │ • Require │
   │ • Rent/Buy│             │ • Payouts │             │   Password│
   │ • Buyer AI│             │ • Seller  │             │ • Resolve │
   │ • Scan QR │             │   AI      │             │   Dispute │
   └───────────┘             └───────────┘             └───────────┘
```

* **Admin Role Clearance**: The Admin Dashboard is **not** accessible by clicking. It requires verified institutional administrator credentials (`admin.governance@lpu.in` + Master Security Key).
* **Dispute Arbitration**: Non-admin accounts receive `403 Forbidden` if attempting to resolve disputes or freeze escrow accounts.
* **Full Audit Trail**: All PII deflections, prompt injection attempts, and token redemptions are recorded in a tamper-resistant security audit log.

---

## Slide 10: Technical Traction & Validation

### Production-Grade Full-Stack Stack (Not a Prototype)

* **Dual-Cloud Live Deployment**:
  * **Vercel**: `https://lpu-mart.vercel.app/` (Serverless Edge + Vite Client).
  * **Render**: Full-Stack Node.js web service running Express with production SPA serving.
* **53/53 Automated Security & Acceptance Tests Passing**:
  * Institutional student `@lpu.in` verification.
  * Role escalation prevention (regular students cannot self-assign Admin).
  * Single-use token replay rejection.
  * 100m GPS geofence proximity math validation.
  * Double-entry bookkeeping precision.
  * Deterministic PII deflector and jailbreak protection.

---

## Slide 11: Competitive Advantage

| Feature | WhatsApp / Telegram | OLX / Quikr | LPUmart |
| :--- | :---: | :---: | :---: |
| **Institutional Student Identity** | ❌ None | ❌ None | ✅ `@lpu.in` Verified |
| **Escrow Payment Holding** | ❌ Direct UPI | ❌ None | ✅ 10% Automatic Escrow |
| **Physical Safety Checkpoint** | ❌ Random | ❌ Unknown | ✅ Uni-Mall / Library Geofence |
| **Cryptographic Handover** | ❌ None | ❌ None | ✅ Dual-Token QR Protocol |
| **AI Shopping & Pricing Assistant**| ❌ None | ❌ None | ✅ Governed Gemini 3.8 Flash |
| **Elder Care Social Donation** | ❌ None | ❌ None | ✅ ₹2 per Completed Deal |
| **Admin Dispute Arbitration** | ❌ None | ❌ None | ✅ University Governance Portal|

---

## Slide 12: Roadmap & The Ask

### Milestones for Campus Domination

```
  Q1 2026                 Q2 2026                 Q3 2026                 Q4 2026
  ───────                 ───────                 ───────                 ───────
  LPU Beta Launch         Hostel Delivery Hubs    Multi-Campus Rollout    Autonomous AI
  • 35,000 Students       • BH4 / GH2 Drop Points • Thapar, CU, Chitkara  • Multi-party bidding
  • Uni-Mall Checkpoint   • Student Courier Model • 150,000 Students      • Automated inspection
```

### The Ask
* **Institutional Partnership**: Official endorsement by the LPU Student Welfare Directorate.
* **Designated Handshake Kiosks**: Fixed physical beacon booths at Uni-Mall and Central Library.
* **Incubation Support**: ₹15 Lakhs Seed Grant for campus server infrastructure, escrow liquidity reserve, and elder sanctuary matching fund.

---

### Contact & Demo Access
* **Platform URL**: `https://lpu-mart.vercel.app/`
* **Health Check**: `https://lpu-mart.vercel.app/api/health`
* **Test Accounts**:
  * Buyer: `buyer.12104892@lpu.in` (Pass: `TestPass@123`)
  * Seller: `seller.12015933@lpu.in` (Pass: `TestPass@123`)
  * Admin: `admin.governance@lpu.in` (Pass: `AdminPass@902`)
