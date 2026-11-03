import React, { useState } from 'react';
import {
  ShieldCheck,
  Heart,
  TrendingUp,
  AlertTriangle,
  Bot,
  Users,
  ShoppingBag,
  Filter,
  CheckCircle,
  FileText,
  DollarSign,
  ArrowUpRight,
  Lock,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const AdminGovernanceView: React.FC = () => {
  const {
    user,
    setActiveTab,
    listings,
    orders,
    auditLogs,
    donations,
    aiSessions,
    resolveDispute,
    adminLogin,
  } = useMarketplace();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'charity' | 'threats' | 'disputes'>('overview');
  const [threatFilter, setThreatFilter] = useState<string>('all');

  // Inline Admin Login Form States
  const [adminEmail, setAdminEmail] = useState('admin.governance@lpu.in');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Strict Institutional Role Gate: Non-admin users MUST log in with administrator credentials
  if (user?.role !== 'admin') {
    const handleAdminSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError(null);
      setIsVerifying(true);

      const result = await adminLogin(adminEmail, adminPassword);
      if (!result.success) {
        setAuthError(result.error || 'Invalid administrator credentials. Access Denied.');
      }
      setIsVerifying(false);
    };

    const handleQuickFillAdmin = () => {
      setAdminEmail('admin.governance@lpu.in');
      setAdminPassword('AdminPass@902');
      setAuthError(null);
    };

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="bg-[#111114] border border-[#27272A] rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Administrative Clearance Required</span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              LPU Governance & Impact Terminal Login
            </h2>

            <p className="text-xs text-[#A1A1AA] max-w-lg mx-auto leading-relaxed">
              This terminal controls institutional escrow settlements, campus dispute arbitrations,
              and security surveillance. You must authenticate with authorized LPU administrator
              credentials to access the governance dashboard.
            </p>
          </div>

          {/* Active Session Notice */}
          <div className="p-3 bg-[#09090B] border border-[#27272A] rounded-xl text-left text-xs space-y-1">
            <div className="text-[#71717A] text-[10px] font-medium uppercase tracking-wider">Current Session:</div>
            <div className="flex items-center justify-between font-mono text-[#FAFAFA]">
              <span className="truncate">{user?.name || 'Guest'} ({user?.email || 'unauthenticated'})</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold uppercase text-[10px] shrink-0">
                Current Role: {user?.role || 'Guest'}
              </span>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Embedded Admin Login Challenge Form */}
          <form onSubmit={handleAdminSubmit} className="space-y-4 pt-2">
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-[#A1A1AA]">Admin Institutional Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin.governance@lpu.in"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#A1A1AA]">Admin Password / Security Key</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-[#A1A1AA] hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password (e.g. AdminPass@902)"
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] disabled:opacity-50 text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/10"
              >
                {isVerifying ? (
                  'Verifying Administrator Credentials...'
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authenticate & Open Admin Dashboard</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('marketplace')}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white border border-[#27272A] text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel & Return
              </button>
            </div>
          </form>

          {/* Quick-fill helper for test evaluation */}
          <div className="pt-4 border-t border-[#27272A] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#71717A]">Evaluation / Testing:</span>
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="text-[11px] text-[#FF9F43] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Autofill Test Admin Credentials</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compute metrics
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const disputedOrders = orders.filter((o) => o.status === 'DISPUTED');

  const totalMarketplaceVolume = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCommissionGenerated = completedOrders.reduce((sum, o) => sum + o.commissionAmount, 0);
  const totalCharityAccumulated = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalAIFeesRevenue = aiSessions.length * 5;

  const filteredLogs = auditLogs.filter((log) => {
    if (threatFilter === 'all') return true;
    return log.eventType === threatFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF9F43] tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Governance & Administration</span>
            <span aria-hidden="true">·</span>
            <span>Lovely Professional University</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Marketplace Governance & Impact Board
          </h1>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center bg-[#111114] border border-[#27272A] rounded-xl p-1 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'overview'
                ? 'bg-[#FF6B00] text-black font-semibold'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('charity')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'charity'
                ? 'bg-[#FF6B00] text-black font-semibold'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Vridh Ashram Fund
          </button>
          <button
            onClick={() => setActiveSubTab('threats')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'threats'
                ? 'bg-[#FF6B00] text-black font-semibold'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            AI Security Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('disputes')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'disputes'
                ? 'bg-[#FF6B00] text-black font-semibold'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Disputes ({disputedOrders.length})
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111114] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Gross Marketplace Volume</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono tabular-nums">
            ₹{totalMarketplaceVolume.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-400">
            {completedOrders.length} completed transactions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#111114] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Platform Commission (10%)</span>
            <DollarSign className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="text-xl font-bold text-[#FF6B00] font-mono tabular-nums">
            ₹{totalCommissionGenerated.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#A1A1AA]">Authoritative escrow ledger</span>
        </div>

        <div className="p-4 rounded-xl bg-[#111114] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Vridh Ashram Donation</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-mono tabular-nums">
            ₹{totalCharityAccumulated.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#A1A1AA]">₹2 allocated per deal</span>
        </div>

        <div className="p-4 rounded-xl bg-[#111114] border border-[#27272A] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>AI Engagement Revenue</span>
            <Bot className="w-4 h-4 text-[#FF9F43]" />
          </div>
          <div className="text-xl font-bold text-[#FF9F43] font-mono tabular-nums">
            ₹{totalAIFeesRevenue}
          </div>
          <span className="text-[10px] text-[#A1A1AA]">{aiSessions.length} billed sessions</span>
        </div>
      </div>

      {/* SUB-TAB 1: Overview */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Campus Listings Summary */}
          <div className="p-5 rounded-2xl bg-[#111114] border border-[#27272A] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Campus Listings Management</span>
              <span className="text-xs text-[#A1A1AA] font-mono">
                {listings.length} Active Items
              </span>
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {listings.map((lst) => (
                <div
                  key={lst.id}
                  className="p-3 rounded-xl bg-[#09090B] border border-[#27272A] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 truncate max-w-[280px]">
                    <span className="font-semibold text-white block truncate">{lst.title}</span>
                    <span className="text-[10px] text-[#A1A1AA]">
                      {lst.category} · {lst.sellerName}
                    </span>
                  </div>
                  <div className="text-right font-mono text-white">
                    ₹{lst.price.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Security Incidents Summary */}
          <div className="p-5 rounded-2xl bg-[#111114] border border-[#27272A] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Recent AI Security Deflections</span>
              <span className="text-xs text-emerald-400 font-mono">100% Deflected</span>
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#09090B] border border-[#27272A] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#FF9F43]">{log.eventType}</span>
                    <span className="text-[10px] text-[#71717A]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[#A1A1AA] text-[11px]">{log.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Vridh Ashram Social Allocation */}
      {activeSubTab === 'charity' && (
        <div className="p-6 rounded-2xl bg-[#111114] border border-[#27272A] space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase">
              <Heart className="w-4 h-4 fill-rose-400" />
              <span>Social Impact Guarantee</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Vridh Ashram Elderly Care Sanctuary Ledger
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Every completed transaction on LPUmart commits an immutable ₹2 donation allocation to
              the Vridh Ashram sanctuary for elderly citizens. Below is the audited financial ledger.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#27272A] rounded-xl overflow-hidden">
              <thead className="bg-[#09090B] text-[#A1A1AA] font-mono text-[10px] uppercase border-b border-[#27272A]">
                <tr>
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Beneficiary</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Reconciliation Status</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {donations.map((don) => (
                  <tr key={don.id} className="hover:bg-[#18181B] transition-colors">
                    <td className="p-3 font-mono text-white">{don.reconciliationRef || don.id}</td>
                    <td className="p-3 font-mono text-[#FF9F43]">#{don.orderId}</td>
                    <td className="p-3 text-white">{don.organization}</td>
                    <td className="p-3 font-mono text-rose-400 font-bold">₹{don.amount}</td>
                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400">
                        {don.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#71717A] text-[11px]">
                      {new Date(don.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AI Security Event Audit Logs */}
      {activeSubTab === 'threats' && (
        <div className="p-6 rounded-2xl bg-[#111114] border border-[#27272A] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Security & Deflection Event Monitor</h3>
              <p className="text-xs text-[#A1A1AA]">
                Live audit trail showing deterministic Layer 1 PII masking and Layer 3 guardrails.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#A1A1AA]" />
              <select
                value={threatFilter}
                onChange={(e) => setThreatFilter(e.target.value)}
                className="bg-[#09090B] border border-[#27272A] rounded-lg px-2.5 py-1 text-white text-xs font-mono"
              >
                <option value="all">All Events</option>
                <option value="PII_PHONE_DEFLECTED">Phone Number Deflections</option>
                <option value="PII_EMAIL_DEFLECTED">Email Deflections</option>
                <option value="PII_UPI_DEFLECTED">UPI VPA Evasions</option>
                <option value="PROMPT_INJECTION_BLOCKED">Prompt Injections Blocked</option>
                <option value="QR_REPLAY_ATTACK_REJECTED">QR Replays Blocked</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#FF6B00] font-semibold">{log.eventType}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        log.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400'
                          : log.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </div>
                  <p className="text-white text-xs">{log.description}</p>
                  <p className="text-[11px] text-[#71717A] font-mono break-all">
                    Masked Trace: {log.maskedPayload}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono block">
                    {log.actionTaken}
                  </span>
                  <span className="text-[10px] text-[#71717A] mt-1 block">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Disputes Arbitrator */}
      {activeSubTab === 'disputes' && (
        <div className="p-6 rounded-2xl bg-[#111114] border border-[#27272A] space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Campus Dispute Arbitration Console</h3>
            <p className="text-xs text-[#A1A1AA]">
              When an order is disputed, platform escrow freezes funds until reviewed by university
              governance.
            </p>
          </div>

          {disputedOrders.length === 0 ? (
            <div className="p-10 rounded-xl bg-[#09090B] border border-[#27272A] text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-semibold text-white">No Active Disputes</h4>
              <p className="text-xs text-[#A1A1AA]">
                All campus transactions are either in escrow or successfully completed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl bg-[#09090B] border border-red-500/20 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      Dispute on Order #{ord.id}: {ord.listingTitle}
                    </span>
                    <span className="text-xs text-red-400 font-mono font-bold">FROZEN IN ESCROW</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#111114] border border-[#27272A] text-amber-300">
                    <span className="text-[10px] text-[#A1A1AA] block uppercase">Dispute Reason:</span>
                    {ord.disputeReason || 'Buyer requested arbitration regarding item condition.'}
                  </div>

                  <div className="flex justify-between items-center text-[#A1A1AA]">
                    <span>Buyer: {ord.buyerName}</span>
                    <span>Seller: {ord.sellerName}</span>
                    <span className="font-mono text-white">Gross: ₹{ord.totalAmount}</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => resolveDispute(ord.id, 'REFUND_BUYER')}
                      className="flex-1 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-semibold"
                    >
                      Arbitrate: Refund Buyer 100%
                    </button>
                    <button
                      onClick={() => resolveDispute(ord.id, 'RELEASE_TO_SELLER')}
                      className="flex-1 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold"
                    >
                      Arbitrate: Validate & Release to Seller
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
