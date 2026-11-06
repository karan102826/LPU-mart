import React from 'react';
import {
  ShoppingBag,
  Bot,
  ShieldAlert,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Bell,
  User,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { AuthModal } from './auth/AuthModal';
import { NotificationDrawer } from './notifications/NotificationDrawer';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    setUserRole,
    openAIModal,
    orders,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
  } = useMarketplace();

  const activeHandshakeCount = orders.filter(
    (o) => o.status === 'ACCEPTED_IN_ESCROW' || o.status === 'HANDSHAKE_READY'
  ).length;

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Desktop Top Bar Contract: Zone 1 (Brand) - Zone 2 (5 Clean Links) - Zone 3 (Profile & Role) */}
      <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-b border-[#27272A] px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('marketplace')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9F43] flex items-center justify-center font-bold text-black text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
                LM
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                  LPUmart
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>
                </span>
                <span className="hidden sm:block text-[10px] text-[#A1A1AA] tracking-wider uppercase">
                  Governed Campus Marketplace
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#A1A1AA]">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'marketplace' ? 'text-[#FF6B00] font-semibold' : ''
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Marketplace
            </button>

            <button
              onClick={() => openAIModal()}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'ai' ? 'text-[#FF6B00] font-semibold' : ''
              }`}
            >
              <Bot className="w-4 h-4 text-[#FF9F43]" />
              AI Assistant
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-medium">Free</span>
            </button>

            <button
              onClick={() => setActiveTab('security_lab')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'security_lab' ? 'text-[#FF6B00] font-semibold' : ''
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-[#FF6B00]" />
              AI Security Lab
            </button>

            <button
              onClick={() => setActiveTab('handshake')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'handshake' ? 'text-[#FF6B00] font-semibold' : ''
              }`}
            >
              <QrCode className="w-4 h-4" />
              Handshake & Escrow
              {activeHandshakeCount > 0 && (
                <span className="text-[10px] bg-[#FF6B00] text-black font-bold px-1.5 rounded-full">
                  {activeHandshakeCount}
                </span>
              )}
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'admin' ? 'text-[#FF6B00] font-semibold' : ''
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Governance & Impact
              </button>
            )}

            <button
              onClick={() => setActiveTab('login')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'login' ? 'text-[#FF6B00] font-semibold' : ''
              }`}
            >
              <User className="w-4 h-4" />
              Login / Account
            </button>
          </nav>

          {/* Zone 3: Notification Bell, Profile & Interactive Role Selector */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell Button */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded-lg bg-[#111114] border border-[#27272A] text-[#A1A1AA] hover:text-white transition-colors"
              title="Campus Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B00] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Role Switcher Pill - Buyer & Seller for students; Admin capability only if authenticated as Admin */}
            <div className="hidden sm:flex items-center bg-[#111114] border border-[#27272A] rounded-lg p-0.5 text-xs font-medium">
              <button
                onClick={() => setUserRole('buyer')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  user.role === 'buyer' ? 'bg-[#FF6B00] text-black font-semibold' : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Buyer
              </button>
              <button
                onClick={() => setUserRole('seller')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  user.role === 'seller' ? 'bg-[#FF6B00] text-black font-semibold' : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Seller
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    setUserRole('admin');
                    setActiveTab('admin');
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    user.role === 'admin' ? 'bg-[#FF6B00] text-black font-semibold' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  Admin
                </button>
              )}
            </div>

            {/* Student Verified Identity Card / Sign-In Button */}
            <button
              onClick={openAuthModal}
              className="flex items-center gap-2 bg-[#111114] hover:bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] px-2.5 py-1.5 rounded-lg transition-all text-left"
              title="Click to Switch Student or Sign In"
            >
              <div className="w-6 h-6 rounded-full bg-[#27272A] text-white flex items-center justify-center text-xs font-semibold">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <div className="flex items-center gap-1 text-xs font-semibold text-white">
                  <span>{user.name.split(' ')[0]}</span>
                  {user.verifiedStudent && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  )}
                </div>
                <div className="text-[10px] text-[#A1A1AA] font-mono">
                  Reg: {user.registrationNumber}
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Auth & Student Verification Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

      {/* Persistent Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkRead={markNotificationRead}
        onNavigateToHandshake={() => setActiveTab('handshake')}
      />

      {/* Mobile Ergonomic Bottom Navigation Bar (< 15% Viewport Cap) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090B]/95 backdrop-blur-lg border-t border-[#27272A] py-2 px-3">
        <div className="flex items-center justify-around text-center">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium transition-colors ${
              activeTab === 'marketplace' ? 'text-[#FF6B00]' : 'text-[#A1A1AA]'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Store</span>
          </button>

          <button
            onClick={() => openAIModal()}
            className="flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium text-[#FF9F43]"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 text-[8px] bg-emerald-400 text-black font-bold px-1 rounded-full">
                Free
              </span>
            </div>
            <span>AI Bot</span>
          </button>

          <button
            onClick={() => setActiveTab('security_lab')}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium transition-colors ${
              activeTab === 'security_lab' ? 'text-[#FF6B00]' : 'text-[#A1A1AA]'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span>Sec Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('handshake')}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium relative transition-colors ${
              activeTab === 'handshake' ? 'text-[#FF6B00]' : 'text-[#A1A1AA]'
            }`}
          >
            <div className="relative">
              <QrCode className="w-5 h-5" />
              {activeHandshakeCount > 0 && (
                <span className="absolute -top-1 -right-2 text-[9px] bg-[#FF6B00] text-black font-bold px-1 rounded-full">
                  {activeHandshakeCount}
                </span>
              )}
            </div>
            <span>Escrow</span>
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium transition-colors ${
                activeTab === 'admin' ? 'text-[#FF6B00]' : 'text-[#A1A1AA]'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Admin</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('login')}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium transition-colors ${
              activeTab === 'login' ? 'text-[#FF6B00]' : 'text-[#A1A1AA]'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Login</span>
          </button>
        </div>
      </nav>
    </>
  );
};
