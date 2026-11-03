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
import { NotificationItem } from '../components/notifications/NotificationDrawer';

export type NavigationTab = 'marketplace' | 'ai' | 'security_lab' | 'handshake' | 'admin' | 'login';

interface MarketplaceContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  setUserRole: (role: 'buyer' | 'seller' | 'admin', adminPassword?: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  isAdminLoginModalOpen: boolean;
  openAdminLoginModal: () => void;
  closeAdminLoginModal: () => void;
  listings: Listing[];
  addListing: (
    listingData: Omit<
      Listing,
      'id' | 'createdAt' | 'views' | 'sellerId' | 'sellerName' | 'sellerRating' | 'sellerVerified'
    >
  ) => Promise<void>;
  orders: Order[];
  createOrder: (
    listingId: string,
    orderType: 'buy' | 'rent',
    rentalDays?: number,
    locationId?: string
  ) => Promise<Order>;
  acceptOrder: (orderId: string) => Promise<void>;
  raiseDispute: (orderId: string, reason: string) => Promise<void>;
  resolveDispute: (orderId: string, resolution: 'REFUND_BUYER' | 'RELEASE_TO_SELLER') => Promise<void>;
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeListingForAI: Listing | null;
  openAIModal: (listing?: Listing) => void;
  isAIModalOpen: boolean;
  closeAIModal: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [aiSessions, setAiSessions] = useState<AISession[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [handshakes, setHandshakes] = useState<Record<string, DualTokenHandshake>>({});
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_001',
      userId: INITIAL_USER.id,
      title: 'Order Handshake Ready',
      message: 'Your purchase request for Apple MacBook Air M1 was accepted. Meet at Uni-Mall!',
      type: 'ORDER_ACCEPTED',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif_002',
      userId: INITIAL_USER.id,
      title: '₹2 Vridh Ashram Contribution',
      message: 'Your completed order #ord_102 successfully contributed ₹2 to Vridh Ashram Sanctuary.',
      type: 'DONATION_RECORDED',
      read: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  // Sync with backend API on mount
  useEffect(() => {
    fetch('/api/listings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.listings?.length) setListings(data.listings);
      })
      .catch((err) => console.warn('Backend /api/listings fetch notice:', err));

    fetch('/api/donations')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.donations?.length) setDonations(data.donations);
      })
      .catch((err) => console.warn('Backend /api/donations fetch notice:', err));

    generateDualTokenHandshake('ord_101', 'loc_unimall').then((hs) => {
      setHandshakes((prev) => ({ ...prev, ord_101: hs }));
    });
  }, []);

  const openAdminLoginModal = () => setIsAdminLoginModalOpen(true);
  const closeAdminLoginModal = () => setIsAdminLoginModalOpen(false);

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Administrator authentication failed.' };
      }
      setUser(data.profile);
      setIsAdminLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Connection error during administrator authentication.' };
    }
  };

  const setUserRole = async (
    role: 'buyer' | 'seller' | 'admin',
    adminPassword?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (role === 'admin' && user?.role !== 'admin' && !adminPassword) {
      setIsAdminLoginModalOpen(true);
      return { success: false, error: 'Administrator authentication required.' };
    }

    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({ newRole: role, adminPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.profile);
        return { success: true };
      } else {
        if (role === 'admin') {
          setIsAdminLoginModalOpen(true);
        }
        return { success: false, error: data.error || 'Failed to switch capability.' };
      }
    } catch (_) {
      if (role !== 'admin') {
        setUser((prev) => ({ ...prev, role }));
        return { success: true };
      }
      return { success: false, error: 'Connection error during role update.' };
    }
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

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    fetch(`/api/notifications/${id}/read`, { method: 'PUT' }).catch(() => {});
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

  const addListing = async (
    listingData: Omit<
      Listing,
      'id' | 'createdAt' | 'views' | 'sellerId' | 'sellerName' | 'sellerRating' | 'sellerVerified'
    >
  ) => {
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify(listingData),
      });

      if (res.ok) {
        const data = await res.json();
        setListings((prev) => [data.listing, ...prev]);
        return;
      }
    } catch (_) {}

    // Local fallback
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
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({ listingId, orderType, rentalDays, meetingLocationId: locationId }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => [data.order, ...prev]);
        return data.order;
      }
    } catch (_) {}

    const listing = listings.find((l) => l.id === listingId);
    if (!listing) throw new Error('Listing not found');

    const totalAmount =
      orderType === 'buy' ? listing.price : (listing.rentalRatePerDay || 50) * rentalDays;

    const split = calculateEscrowSplit(totalAmount);
    const orderId = `ord_${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      id: orderId,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
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
    try {
      const res = await fetch(`/api/orders/${orderId}/accept`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.id}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (data.tokens) {
          setHandshakes((prev) => ({
            ...prev,
            [orderId]: {
              orderId,
              buyerToken: data.tokens.buyerToken,
              sellerToken: data.tokens.sellerToken,
              tokenHash: data.order.token_hash,
              expiresAt: data.tokens.expiresAt,
              isConsumed: false,
              meetingLocation: null as any,
            },
          }));
        }
        return;
      }
    } catch (_) {}

    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

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
    try {
      const res = await fetch('/api/handshake/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({ orderId, scannedToken, userLat, userLng }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (data.donation) {
          setDonations((prev) => [data.donation, ...prev]);
        }
        setHandshakes((prev) => ({
          ...prev,
          [orderId]: { ...prev[orderId], isConsumed: true },
        }));
        return { success: true, message: data.message };
      } else if (!res.ok) {
        return { success: false, message: data.message || 'Handshake verification rejected.' };
      }
    } catch (_) {}

    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found in database.' };

    const handshake = handshakes[orderId];
    if (!handshake) return { success: false, message: 'Handshake token not generated.' };

    const result = verifyHandshake({
      scannedToken,
      expectedToken: handshake.buyerToken,
      tokenExpiresAt: handshake.expiresAt,
      isAlreadyConsumed: handshake.isConsumed,
      userLat,
      userLng,
      locationId: order.meetingLocationId || 'loc_unimall',
    });

    if (!result.success) return { success: false, message: result.message };

    setHandshakes((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], isConsumed: true },
    }));

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'COMPLETED', completedAt: new Date().toISOString() } : o
      )
    );

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

    return { success: true, message: result.message };
  };

  const raiseDispute = async (orderId: string, reason: string) => {
    try {
      await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.id}` },
        body: JSON.stringify({ orderId, reason }),
      });
    } catch (_) {}

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

  const resolveDispute = async (
    orderId: string,
    resolution: 'REFUND_BUYER' | 'RELEASE_TO_SELLER'
  ) => {
    try {
      await fetch(`/api/disputes/${orderId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.id}` },
        body: JSON.stringify({ resolution }),
      });
    } catch (_) {}

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
        setUser,
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
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isAdminLoginModalOpen,
        openAdminLoginModal,
        closeAdminLoginModal,
        adminLogin,
        isNotificationOpen,
        setIsNotificationOpen,
        notifications,
        markNotificationRead,
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
