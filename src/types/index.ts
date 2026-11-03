export type ProductCategory =
  | 'All'
  | 'Laptops'
  | 'Smartphones'
  | 'Electronics'
  | 'Furniture'
  | 'Textbooks'
  | 'Gaming'
  | 'Accessories'
  | 'Household essentials'
  | 'Miscellaneous';

export type ProductCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';

export type ListingType = 'buy' | 'rent' | 'both';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  listingType: ListingType;
  price: number; // in INR
  rentalRatePerDay?: number; // in INR
  rentalDeposit?: number; // in INR
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerVerified: boolean;
  campusLocationId: string;
  available: boolean;
  createdAt: string;
  views: number;
}

export type OrderStatus =
  | 'PENDING_SELLER_ACCEPTANCE'
  | 'ACCEPTED_IN_ESCROW'
  | 'HANDSHAKE_READY'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  orderType: 'buy' | 'rent';
  rentalDays?: number;
  totalAmount: number;
  commissionAmount: number; // 10%
  charityAmount: number; // ₹2 flat to Vridh Ashram
  sellerPayableAmount: number; // total - commission - charity
  status: OrderStatus;
  meetingLocationId: string;
  meetingLocationName: string;
  createdAt: string;
  completedAt?: string;
  transactionTokenHash?: string;
  tokenExpiresAt?: string;
  disputeReason?: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  zone: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  description: string;
}

export interface DualTokenHandshake {
  orderId: string;
  buyerToken: string; // Plain token for QR
  sellerToken: string; // Plain token for seller app
  tokenHash: string; // SHA-256 stored in DB
  expiresAt: string;
  isConsumed: boolean;
  meetingLocation: CampusLocation;
}

export interface SanitizationResult {
  originalText: string;
  sanitizedText: string;
  hasPII: boolean;
  detectedTypes: Array<'PHONE' | 'EMAIL' | 'UPI_VPA' | 'REG_NUMBER' | 'SOCIAL_HANDLE' | 'OFF_PLATFORM_KEYWORD'>;
  redactionCount: number;
  flaggedKeywords: string[];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  sanitizedContent?: string;
  timestamp: string;
  piiDeflected?: boolean;
  detectedTypes?: string[];
}

export interface AISession {
  id: string;
  listingId?: string;
  listingTitle?: string;
  userId: string;
  feeAmount: number; // ₹5
  feeStatus: 'UNPAID' | 'RECORDED' | 'SETTLED';
  idempotencyKey: string;
  createdAt: string;
  messages: AIMessage[];
}

export interface SecurityAuditEvent {
  id: string;
  timestamp: string;
  eventType:
    | 'PII_PHONE_DEFLECTED'
    | 'PII_EMAIL_DEFLECTED'
    | 'PII_UPI_DEFLECTED'
    | 'PII_REG_NO_DEFLECTED'
    | 'PROMPT_INJECTION_BLOCKED'
    | 'OFF_PLATFORM_PAYMENT_BLOCKED'
    | 'DATABASE_ISOLATION_DEFENDED'
    | 'UNAUTHORIZED_FINANCIAL_ACTION'
    | 'QR_REPLAY_ATTACK_REJECTED'
    | 'LOCATION_OUT_OF_BOUNDS_REJECTED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  maskedPayload: string;
  ipAddress: string;
  actionTaken: string;
}

export interface DonationRecord {
  id: string;
  orderId: string;
  amount: number; // ₹2
  organization: string; // 'Vridh Ashram'
  status: 'ALLOCATED' | 'RECONCILED' | 'TRANSFERRED';
  timestamp: string;
  reconciliationRef?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  registrationNumber: string; // Encrypted / never exposed publicly
  email: string;
  phone: string;
  hostel: string;
  department: string;
  verifiedStudent: boolean;
  role: 'buyer' | 'seller' | 'admin';
  walletBalance: number;
  aiFeesAccumulated: number;
}
