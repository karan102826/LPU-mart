-- ==============================================================================
-- LPUmart — Production PostgreSQL Database Schema & RLS Policies
-- Hyper-localized Campus Marketplace & Governed AI Agent Ecosystem
-- Lovely Professional University (LPU)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. USERS & INSTITUTIONAL STUDENT IDENTITY
-- ==============================================================================

CREATE TYPE student_verification_status AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE user_role_type AS ENUM ('buyer', 'seller', 'admin');

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  registration_number VARCHAR(16) UNIQUE NOT NULL, -- LPU 8-digit reg no
  department VARCHAR(150) DEFAULT 'School of Computer Science & Engineering',
  hostel VARCHAR(150),
  role user_role_type DEFAULT 'buyer',
  verification_status student_verification_status DEFAULT 'PENDING',
  wallet_balance_paise BIGINT DEFAULT 0, -- Stored in paise (1 INR = 100 paise)
  ai_fees_accumulated_paise BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  id_card_url TEXT,
  institutional_email VARCHAR(255) NOT NULL,
  status student_verification_status DEFAULT 'PENDING',
  verified_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role_type NOT NULL,
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, role)
);

-- ==============================================================================
-- 2. CAMPUS LOCATIONS & GEOFENCING
-- ==============================================================================

CREATE TABLE IF NOT EXISTS campus_locations (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  zone VARCHAR(100) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  radius_meters INT DEFAULT 100,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. MARKETPLACE CATALOG & LISTINGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0
);

CREATE TYPE listing_condition AS ENUM ('Brand New', 'Like New', 'Good', 'Fair');
CREATE TYPE listing_offer_type AS ENUM ('buy', 'rent', 'both');

CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id VARCHAR(64) NOT NULL REFERENCES categories(id),
  condition listing_condition NOT NULL DEFAULT 'Good',
  listing_type listing_offer_type NOT NULL DEFAULT 'both',
  price_paise BIGINT NOT NULL CHECK (price_paise > 0),
  rental_rate_per_day_paise BIGINT CHECK (rental_rate_per_day_paise IS NULL OR rental_rate_per_day_paise > 0),
  rental_deposit_paise BIGINT DEFAULT 0,
  campus_location_id VARCHAR(64) REFERENCES campus_locations(id),
  available BOOLEAN DEFAULT TRUE,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favourites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, listing_id)
);

CREATE TABLE IF NOT EXISTS listing_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. ORDERS, TRANSACTIONS & ESCROW
-- ==============================================================================

CREATE TYPE order_status_type AS ENUM (
  'PENDING_SELLER_ACCEPTANCE',
  'ACCEPTED_IN_ESCROW',
  'HANDSHAKE_READY',
  'COMPLETED',
  'DISPUTED',
  'CANCELLED',
  'REFUNDED'
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  order_type VARCHAR(10) NOT NULL CHECK (order_type IN ('buy', 'rent')),
  rental_days INT CHECK (rental_days IS NULL OR rental_days > 0),
  gross_amount_paise BIGINT NOT NULL CHECK (gross_amount_paise > 0),
  commission_amount_paise BIGINT NOT NULL DEFAULT 0, -- 10%
  charity_amount_paise BIGINT NOT NULL DEFAULT 200, -- Flat ₹2 (200 paise)
  seller_payable_amount_paise BIGINT NOT NULL DEFAULT 0,
  status order_status_type DEFAULT 'PENDING_SELLER_ACCEPTANCE',
  meeting_location_id VARCHAR(64) REFERENCES campus_locations(id),
  token_hash VARCHAR(64), -- SHA-256 hash of dual tokens
  token_expires_at TIMESTAMPTZ,
  token_consumed BOOLEAN DEFAULT FALSE,
  dispute_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaction_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  buyer_token_preview VARCHAR(32) NOT NULL,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed BOOLEAN DEFAULT FALSE,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS handover_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  verified_by_seller UUID NOT NULL REFERENCES profiles(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  location_id VARCHAR(64) REFERENCES campus_locations(id),
  gps_latitude DOUBLE PRECISION,
  gps_longitude DOUBLE PRECISION,
  distance_meters INT,
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. FINANCIAL DOUBLE-ENTRY LEDGER & VRIDH ASHRAM CHARITY
-- ==============================================================================

CREATE TABLE IF NOT EXISTS escrow_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id),
  held_amount_paise BIGINT NOT NULL,
  commission_paise BIGINT NOT NULL,
  charity_paise BIGINT NOT NULL,
  seller_payable_paise BIGINT NOT NULL,
  status VARCHAR(30) DEFAULT 'HELD', -- HELD, RELEASED, REFUNDED, FROZEN_DISPUTE
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donation_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  amount_paise BIGINT DEFAULT 200, -- ₹2.00
  organization VARCHAR(150) DEFAULT 'Vridh Ashram Elderly Care Sanctuary',
  status VARCHAR(30) DEFAULT 'ALLOCATED', -- ALLOCATED, PENDING_TRANSFER, TRANSFERRED, RECONCILED
  reconciliation_ref VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reconciled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS dispute_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  raised_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'OPEN', -- OPEN, UNDER_REVIEW, REFUND_BUYER, RELEASE_TO_SELLER
  resolution_notes TEXT,
  resolved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ==============================================================================
-- 6. GOVERNED AI AGENT SESSIONS & FEES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS ai_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  listing_id UUID REFERENCES listings(id),
  fee_paise BIGINT DEFAULT 500, -- ₹5.00
  fee_status VARCHAR(30) DEFAULT 'RECORDED', -- UNPAID, RECORDED, SETTLED
  idempotency_key VARCHAR(120) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES ai_sessions(id) ON DELETE CASCADE,
  sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  sanitized_content TEXT,
  pii_deflected BOOLEAN DEFAULT FALSE,
  detected_types TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. NOTIFICATIONS & SECURITY AUDIT LOGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) DEFAULT 'MEDIUM',
  description TEXT NOT NULL,
  masked_payload TEXT,
  ip_address VARCHAR(45),
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_settings (
  key VARCHAR(64) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_records ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can view their own profile; public names are accessible
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- 2. Listings: Anyone can view active listings; sellers can modify only their own
CREATE POLICY "Public can view active listings" ON listings
  FOR SELECT USING (available = TRUE);

CREATE POLICY "Sellers can manage own listings" ON listings
  FOR ALL USING (
    seller_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

-- 3. Orders: Buyers and sellers can view their own orders
CREATE POLICY "Participants can view their orders" ON orders
  FOR SELECT USING (
    buyer_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()) OR
    seller_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

-- 4. Notifications: Users can view only their own notifications
CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT USING (
    user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (
    user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

-- 5. Favourites: Users manage their own favourites
CREATE POLICY "Users manage own favourites" ON favourites
  FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );
