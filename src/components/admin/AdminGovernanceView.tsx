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
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const AdminGovernanceView: React.FC = () => {
  const {
    listings,
    orders,
    auditLogs,
    donations,
    aiSessions,
    resolveDispute,
  } = useMarketplace();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'charity' | 'threats' | 'disputes'>('overview');
  const [threatFilter, setThreatFilter] = useState<string>('all');

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
