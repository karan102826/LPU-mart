import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/Navbar';
import { ProductCatalog } from './components/marketplace/ProductCatalog';
import { SecurityLabView } from './components/security/SecurityLabView';
import { HandshakeView } from './components/escrow/HandshakeView';
import { AdminGovernanceView } from './components/admin/AdminGovernanceView';
import { LoginPage } from './components/auth/LoginPage';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useMarketplace();

  return (
    <div className="min-h-screen bg-[#000000] text-[#FAFAFA] flex flex-col selection:bg-[#FF6B00] selection:text-black">
      {/* Top Bar Navigation */}
      <Navbar />

      {/* Main Tab View Routing */}
      <main className="flex-1">
        {activeTab === 'marketplace' && <ProductCatalog />}
        {activeTab === 'security_lab' && <SecurityLabView />}
        {activeTab === 'handshake' && <HandshakeView />}
        {activeTab === 'admin' && <AdminGovernanceView />}
        {activeTab === 'login' && <LoginPage />}
      </main>

      {/* Governed AI Assistant Dialog */}
      <AIAssistantModal />

      {/* Dedicated Admin Login Modal */}
      <AdminLoginModal />

      {/* Quiet, Polish Footer */}
      <footer className="border-t border-[#27272A] bg-[#09090B] py-8 px-4 md:px-8 text-xs text-[#A1A1AA] pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#FF6B00] to-[#FF9F43] flex items-center justify-center font-bold text-black text-[10px]">
              LM
            </div>
            <span className="font-semibold text-white">LPUmart</span>
            <span>— Governed AI Agent Ecosystem for Lovely Professional University.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-rose-400">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              ₹2 committed to Vridh Ashram per completed deal
            </span>
            <span aria-hidden="true" className="text-[#3F3F46]">·</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              10% Escrow Protection
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MainContent />
    </MarketplaceProvider>
  );
}
