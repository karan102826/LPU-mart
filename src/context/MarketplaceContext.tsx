import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Listing,
  Order,
  UserProfile,
  DonationRecord,
  SecurityAuditEvent,
  AISession,
  DualTokenHandshake,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_LISTINGS,
  INITIAL_ORDERS,
  INITIAL_DONATIONS,
  INITIAL_AUDIT_LOGS,
} from '../lib/data/mockDatabase';
import {
  generateDualTokenHandshake,
  verifyHandshake,
  calculateEscrowSplit,
} from '../lib/escrow/handshake';

export type NavigationTab = 'marketplace' | 'ai' | 'security_lab' | 'handshake' | 'admin';

interface MarketplaceContextType {
  user: UserProfile;
  setUserRole: (role: 'buyer' | 'seller' | 'admin') => void;
  listings: Listing[];
  addListing: (listingData: Omit<Listing, 'id' | 'createdAt' | 'views' | 'sellerId' | 'sellerName' | 'sellerRating' | 'sellerVerified'>) => void;
  orders: Order[];
  createOrder: (listingId: string, orderType: 'buy' | 'rent', rentalDays?: number, locationId?: string) => Promise<Order>;
  acceptOrder: (orderId: string) => Promise<void>;
  raiseDispute: (orderId: string, reason: string) => void;
  resolveDispute: (orderId: string, resolution: 'REFUND_BUYER' | 'RELEASE_TO_SELLER') => void;
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeListingForAI: Listing | null;
  openAIModal: (listing?: Listing) => void;
  isAIModalOpen: boolean;
  closeAIModal: () => void;
  aiSessions: AISession[];
  recordAIFee: (listingId?: string) => Promise<boolean>;
  auditLogs: SecurityAuditEvent[];
  logSecurityEvent: (event: Omit<SecurityAuditEvent, 'id' | 'timestamp'>) => void;
  donations: DonationRecord[];
  handshakes: Record<string, DualTokenHandshake>;
  getOrCreateHandshake: (orderId: string, locationId?: string) => Promise<DualTokenHandshake>;
  verifyAndCompleteHandshake: (
    orderId: string,
    scannedToken: string,
    userLat?: number,
    userLng?: number
  ) => Promise<{ success: boolean; message: string }>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [favorites, setFavorites] = useState<string[]>(['lst_macbook_m1', 'lst_clrs_algorithms']);
  const [activeTab, setActiveTab] = useState<NavigationTab>('marketplace');
  const [activeListingForAI, setActiveListingForAI] = useState<Listing | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiSessions, setAiSessions] = useState<AISession[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [handshakes, setHandshakes] = useState<Record<string, DualTokenHandshake>>({});

  // Initialize handshake for the pre-seeded active order
  useEffect(() => {
    generateDualTokenHandshake('ord_101', 'loc_unimall').then((hs) => {
      setHandshakes((prev) => ({ ...prev, ord_101: hs }));
    });
  }, []);

  const setUserRole = (role: 'buyer' | 'seller' | 'admin') => {
    setUser((prev) => ({ ...prev, role }));
  };

  const toggleFavorite = (listingId: string) => {
    setFavorites((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );
  };

  const openAIModal = (listing?: Listing) => {
    setActiveListingForAI(listing || null);
    setIsAIModalOpen(true);
  };

  const closeAIModal = () => {
    setIsAIModalOpen(false);
  };

  const logSecurityEvent = (event: Omit<SecurityAuditEvent, 'id' | 'timestamp'>) => {
    const newLog: SecurityAuditEvent = {
      ...event,
      id: `sec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const recordAIFee = async (listingId?: string): Promise<boolean> => {
    const fee = 5; // Flat ₹5 per session
    const sessionId = `ses_${Date.now()}`;
    const newSession: AISession = {
      id: sessionId,
      listingId,
      listingTitle: listings.find((l) => l.id === listingId)?.title,
      userId: user.id,
      feeAmount: fee,
      feeStatus: 'RECORDED',
      idempotencyKey: `idemp_${user.id}_${listingId || 'general'}_${new Date().toDateString()}`,
      createdAt: new Date().toISOString(),
      messages: [],
    };

    setAiSessions((prev) => [newSession, ...prev]);
    setUser((prev) => ({
      ...prev,
      aiFeesAccumulated: prev.aiFeesAccumulated + fee,
      walletBalance: Math.max(0, prev.walletBalance - fee),
    }));

    return true;
  };

  const addListing = (
    listingData: Omit<Listing, 'id' | 'createdAt' | 'views' | 'sellerId' | 'sellerName' | 'sellerRating' | 'sellerVerified'>
  ) => {
    const newListing: Listing = {
      ...listingData,
      id: `lst_${Date.now()}`,
      sellerId: user.id,
      sellerName: `${user.name} (${user.department.includes('CSE') ? 'CSE' : 'LPU'})`,
      sellerRating: 5.0,
      sellerVerified: user.verifiedStudent,
      createdAt: new Date().toISOString(),
      views: 1,
    };
    setListings((prev) => [newListing, ...prev]);
  };

  const createOrder = async (
    listingId: string,
    orderType: 'buy' | 'rent',
    rentalDays = 1,
    locationId = 'loc_unimall'
  ): Promise<Order> => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) throw new Error('Listing not found');

    const totalAmount =
      orderType === 'buy'
        ? listing.price
        : (listing.rentalRatePerDay || 50) * rentalDays;

    const split = calculateEscrowSplit(totalAmount);
    const orderId = `ord_${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      id: orderId,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      buyerId: user.id,
      buyerName: user.name,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      orderType,
      rentalDays: orderType === 'rent' ? rentalDays : undefined,
      totalAmount,
      commissionAmount: split.commissionAmount,
      charityAmount: split.charityAmount,
      sellerPayableAmount: split.sellerPayableAmount,
      status: 'PENDING_SELLER_ACCEPTANCE',
      meetingLocationId: locationId,
      meetingLocationName: locationId === 'loc_block34' ? 'Academic Block 34' : 'Uni-Mall Central Plaza',
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const acceptOrder = async (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Generate cryptographic tokens upon seller acceptance
    const handshake = await generateDualTokenHandshake(
      orderId,
      targetOrder.meetingLocationId || 'loc_unimall'
    );

    setHandshakes((prev) => ({ ...prev, [orderId]: handshake }));

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'ACCEPTED_IN_ESCROW',
              transactionTokenHash: handshake.tokenHash,
              tokenExpiresAt: handshake.expiresAt,
            }
          : o
      )
    );
  };

  const getOrCreateHandshake = async (orderId: string, locationId = 'loc_unimall') => {
    if (handshakes[orderId]) return handshakes[orderId];
    const hs = await generateDualTokenHandshake(orderId, locationId);
    setHandshakes((prev) => ({ ...prev, [orderId]: hs }));
    return hs;
  };

  const verifyAndCompleteHandshake = async (
    orderId: string,
    scannedToken: string,
    userLat?: number,
    userLng?: number
  ) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Order not found in campus database.' };
    }

    const handshake = handshakes[orderId];
    if (!handshake) {
      return { success: false, message: 'Handshake token not generated for this order yet.' };
    }

    // Verify token & geofence (<100m)
    const result = verifyHandshake({
      scannedToken,
      expectedToken: handshake.buyerToken,
      tokenExpiresAt: handshake.expiresAt,
      isAlreadyConsumed: handshake.isConsumed,
      userLat,
      userLng,
      locationId: order.meetingLocationId || 'loc_unimall',
    });

    if (result.isReplay) {
      logSecurityEvent({
        eventType: 'QR_REPLAY_ATTACK_REJECTED',
        severity: 'HIGH',
        description: `Rejected replay of already consumed token for order ${orderId}`,
        maskedPayload: scannedToken.slice(0, 8) + '***REPLAY***',
        ipAddress: '10.24.118.99',
        actionTaken: 'Transaction Rejected & Logged',
      });
      return { success: false, message: result.message };
    }

    if (!result.isWithinGeofence && !result.isTokenValid) {
      logSecurityEvent({
        eventType: 'LOCATION_OUT_OF_BOUNDS_REJECTED',
        severity: 'MEDIUM',
        description: `Failed campus proximity check (${result.distanceMeters}m away)`,
        maskedPayload: `Coordinates distance: ${result.distanceMeters}m`,
        ipAddress: '10.24.118.99',
        actionTaken: 'Handshake Blocked',
      });
      return { success: false, message: result.message };
    }

    if (!result.success) {
      return { success: false, message: result.message };
    }

    // Atomically mark handshake consumed and order completed
    setHandshakes((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], isConsumed: true },
    }));

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'COMPLETED',
              completedAt: new Date().toISOString(),
            }
          : o
      )
    );

    // Record immutable ₹2 donation to Vridh Ashram
    const newDonation: DonationRecord = {
      id: `don_${Date.now()}`,
      orderId,
      amount: 2,
      organization: 'Vridh Ashram Elderly Care Sanctuary',
      status: 'ALLOCATED',
      timestamp: new Date().toISOString(),
      reconciliationRef: `VRIDH-TX-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    setDonations((prev) => [newDonation, ...prev]);

    return {
      success: true,
      message: result.message,
    };
  };

  const raiseDispute = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'DISPUTED',
              disputeReason: reason,
            }
          : o
      )
    );
  };

  const resolveDispute = (orderId: string, resolution: 'REFUND_BUYER' | 'RELEASE_TO_SELLER') => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: resolution === 'REFUND_BUYER' ? 'REFUNDED' : 'COMPLETED',
          completedAt: new Date().toISOString(),
        };
      })
    );
  };

  return (
    <MarketplaceContext.Provider
      value={{
        user,
        setUserRole,
        listings,
        addListing,
        orders,
        createOrder,
        acceptOrder,
        raiseDispute,
        resolveDispute,
        favorites,
        toggleFavorite,
        activeTab,
        setActiveTab,
        activeListingForAI,
        openAIModal,
        isAIModalOpen,
        closeAIModal,
        aiSessions,
        recordAIFee,
        auditLogs,
        logSecurityEvent,
        donations,
        handshakes,
        getOrCreateHandshake,
        verifyAndCompleteHandshake,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
};
