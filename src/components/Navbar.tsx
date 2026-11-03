import React from 'react';
import {
  ShoppingBag,
  Bot,
  ShieldAlert,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useMarketplace, NavigationTab } from '../context/MarketplaceContext';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, user, setUserRole, openAIModal, orders } = useMarketplace();

  const activeHandshakeCount = orders.filter(
    (o) => o.status === 'ACCEPTED_IN_ESCROW' || o.status === 'HANDSHAKE_READY'
  ).length;

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
              <span className="text-[10px] text-[#FF9F43] bg-[#FF9F43]/10 px-1.5 py-0.5 rounded font-mono">₹5</span>
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

            <button
              onClick={() => setActiveTab('admin')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'admin' ? 'text-[#FF6B00] font-semibold' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Governance & Impact
            </button>
          </nav>

          {/* Zone 3: Profile & Interactive Role Selector */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role Switcher Pill */}
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
            </div>

            {/* Student Verified Identity Card */}
            <div className="flex items-center gap-2 bg-[#111114] border border-[#27272A] px-2.5 py-1.5 rounded-lg">
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
            </div>
          </div>
        </div>
      </header>

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
              <span className="absolute -top-1 -right-2 text-[8px] bg-[#FF9F43] text-black font-bold px-1 rounded-full">
                ₹5
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

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-medium transition-colors ${
              activeTab === 'admin' ? 'text-[#FF6B00]' : 'text-[#A1A1AA]'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Admin</span>
          </button>
        </div>
      </nav>
    </>
  );
};
