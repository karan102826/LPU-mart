import { CampusLocation, DualTokenHandshake, Order } from '../../types';

// Approved LPU Campus Meeting Locations
export const LPU_CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc_unimall',
    name: 'Uni-Mall Central Plaza',
    zone: 'Commercial Center',
    latitude: 31.2536,
    longitude: 75.7037,
    radiusMeters: 100,
    description: 'Ground floor atrium near food court, CCTV monitored with high student footfall.',
  },
  {
    id: 'loc_block34',
    name: 'Academic Block 34 (Engineering)',
    zone: 'Academic Core',
    latitude: 31.2552,
    longitude: 75.7061,
    radiusMeters: 100,
    description: 'Main entrance portico under canopy with 24/7 security booth.',
  },
  {
    id: 'loc_library',
    name: 'Central University Library',
    zone: 'Academic Core',
    latitude: 31.2541,
    longitude: 75.7052,
    radiusMeters: 100,
    description: 'Outside reception lobby, Block 36.',
  },
  {
    id: 'loc_bh4',
    name: 'Boys Hostel 4 Entrance Gate',
    zone: 'Residential North',
    latitude: 31.2568,
    longitude: 75.7021,
    radiusMeters: 100,
    description: 'Warden verification post and student waiting lounge.',
  },
  {
    id: 'loc_gh2',
    name: 'Girls Hostel 2 Turnstile Gate',
    zone: 'Residential South',
    latitude: 31.2519,
    longitude: 75.7048,
    radiusMeters: 100,
    description: 'Visitor security desk outside turnstile gates.',
  },
];

/**
 * Computes SHA-256 hash in standard hex representation
 */
export async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate cryptographically secure dual tokens for handshake
 */
export async function generateDualTokenHandshake(
  orderId: string,
  locationId: string
): Promise<DualTokenHandshake> {
  const meetingLocation =
    LPU_CAMPUS_LOCATIONS.find((loc) => loc.id === locationId) || LPU_CAMPUS_LOCATIONS[0];

  // Cryptographically secure random tokens
  const buyerRawBytes = new Uint8Array(16);
  const sellerRawBytes = new Uint8Array(16);
  crypto.getRandomValues(buyerRawBytes);
  crypto.getRandomValues(sellerRawBytes);

  const buyerHex = Array.from(buyerRawBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const sellerHex = Array.from(sellerRawBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const buyerToken = `LPU-BUY-${orderId.slice(0, 6).toUpperCase()}-${buyerHex.slice(0, 8)}`;
  const sellerToken = `LPU-SEL-${orderId.slice(0, 6).toUpperCase()}-${sellerHex.slice(0, 8)}`;

  // Combined token signature stored as SHA-256 hash
  const tokenHash = await sha256Hex(`${buyerToken}::${sellerToken}::${orderId}`);

  // 15 minutes TTL
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  return {
    orderId,
    buyerToken,
    sellerToken,
    tokenHash,
    expiresAt,
    isConsumed: false,
    meetingLocation,
  };
}

/**
 * Haversine formula to compute great-circle distance between two GPS coordinates in meters
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface HandshakeVerificationParams {
  scannedToken: string;
  expectedToken: string;
  tokenExpiresAt: string;
  isAlreadyConsumed: boolean;
  userLat?: number;
  userLng?: number;
  locationId: string;
}

export interface HandshakeVerificationResult {
  success: boolean;
  message: string;
  distanceMeters?: number;
  isWithinGeofence: boolean;
  isTokenValid: boolean;
  isExpired: boolean;
  isReplay: boolean;
}

export function verifyHandshake({
  scannedToken,
  expectedToken,
  tokenExpiresAt,
  isAlreadyConsumed,
  userLat,
  userLng,
  locationId,
}: HandshakeVerificationParams): HandshakeVerificationResult {
  // 1. Replay check
  if (isAlreadyConsumed) {
    return {
      success: false,
      message: 'Replay rejected: This QR handshake token has already been consumed.',
      isTokenValid: false,
      isExpired: false,
      isReplay: true,
      isWithinGeofence: false,
    };
  }

  // 2. Expiration check
  const isExpired = new Date(tokenExpiresAt).getTime() < Date.now();
  if (isExpired) {
    return {
      success: false,
      message: 'Token expired: The 15-minute handshake window has lapsed. Please regenerate.',
      isTokenValid: false,
      isExpired: true,
      isReplay: false,
      isWithinGeofence: false,
    };
  }

  // 3. Token authenticity check
  const isTokenValid = scannedToken.trim() === expectedToken.trim();
  if (!isTokenValid) {
    return {
      success: false,
      message: 'Invalid handshake token: Security signature does not match this transaction.',
      isTokenValid: false,
      isExpired: false,
      isReplay: false,
      isWithinGeofence: false,
    };
  }

  // 4. Geofence proximity check
  const location =
    LPU_CAMPUS_LOCATIONS.find((loc) => loc.id === locationId) || LPU_CAMPUS_LOCATIONS[0];

  let distanceMeters = 0;
  let isWithinGeofence = true;

  if (userLat !== undefined && userLng !== undefined) {
    distanceMeters = calculateDistanceMeters(
      userLat,
      userLng,
      location.latitude,
      location.longitude
    );
    isWithinGeofence = distanceMeters <= location.radiusMeters;
  }

  if (!isWithinGeofence) {
    return {
      success: false,
      message: `Geofence check failed: You are ${distanceMeters}m away from ${location.name} (Max allowed: ${location.radiusMeters}m).`,
      distanceMeters,
      isWithinGeofence: false,
      isTokenValid: true,
      isExpired: false,
      isReplay: false,
    };
  }

  return {
    success: true,
    message: `Campus Handshake verified successfully at ${location.name} (${distanceMeters}m from checkpoint). Order completed!`,
    distanceMeters,
    isWithinGeofence: true,
    isTokenValid: true,
    isExpired: false,
    isReplay: false,
  };
}

/**
 * Escrow financial calculation: 10% platform commission, ₹2 Vridh Ashram allocation
 */
export function calculateEscrowSplit(grossAmount: number) {
  const commission = Math.round(grossAmount * 0.1); // 10%
  const charity = 2; // Flat ₹2 Vridh Ashram
  const sellerNet = Math.max(0, grossAmount - commission - charity);

  return {
    grossAmount,
    commissionAmount: commission,
    charityAmount: charity,
    sellerPayableAmount: sellerNet,
  };
}
