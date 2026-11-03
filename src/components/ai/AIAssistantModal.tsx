import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Bot,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { sanitizeUserInput, createSafeThreatSummary } from '../../lib/sanitization/piiDeflector';
import { projectPublicListingAttributes, getAIProvider } from '../../lib/ai/provider';
import { AIMessage } from '../../types';

export const AIAssistantModal: React.FC = () => {
  const {
    isAIModalOpen,
    closeAIModal,
    activeListingForAI,
    recordAIFee,
    user,
    logSecurityEvent,
  } = useMarketplace();

  // Fee acceptance gate
  const [feeAccepted, setFeeAccepted] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'openai' | 'anthropic' | 'deterministic'>('gemini');
  const [lastSanitizationAlert, setLastSanitizationAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAIModalOpen) {
      // Check if general or item-specific
      setFeeAccepted(false);
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          content: activeListingForAI
            ? `Hello ${user.name.split(' ')[0]}! I am LPUmart AI. I can answer questions about "${activeListingForAI.title}", explain condition, verify campus meeting locations (like Uni-Mall), and review rental policies. How can I help you?`
            : `Hello ${user.name.split(' ')[0]}! I am LPUmart AI. Ask me about verified campus listings, buy vs rent options, our 10% platform safety escrow, or our ₹2 donation to Vridh Ashram.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setLastSanitizationAlert(null);
    }
  }, [isAIModalOpen, activeListingForAI]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAIModalOpen) return null;

  const handleAcceptFeeAndStart = async () => {
    await recordAIFee(activeListingForAI?.id);
    setFeeAccepted(true);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawInput = textToSend || inputText;
    if (!rawInput.trim() || isLoading) return;

    setInputText('');
    setLastSanitizationAlert(null);

    // STEP 1: Layer 1 Deterministic Input Inspection
    const sanitization = sanitizeUserInput(rawInput);

    if (sanitization.hasPII) {
      setLastSanitizationAlert(
        `Layer 1 Deflected: Blocked [${sanitization.detectedTypes.join(', ')}] — Masked sensitive portion with protected notice.`
      );

      // Log threat audit event without saving the raw sensitive payload
      logSecurityEvent({
        eventType:
          sanitization.detectedTypes.includes('PHONE')
            ? 'PII_PHONE_DEFLECTED'
            : sanitization.detectedTypes.includes('EMAIL')
            ? 'PII_EMAIL_DEFLECTED'
            : sanitization.detectedTypes.includes('UPI_VPA')
            ? 'PII_UPI_DEFLECTED'
            : 'PII_REG_NO_DEFLECTED',
        severity: 'MEDIUM',
        description: createSafeThreatSummary(sanitization),
        maskedPayload: sanitization.sanitizedText.slice(0, 100),
        ipAddress: '10.24.118.42',
        actionTaken: 'Sanitized & Masked before LLM Dispatch',
      });
    }

    const userMsg: AIMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      content: rawInput,
      sanitizedContent: sanitization.sanitizedText,
      piiDeflected: sanitization.hasPII,
      detectedTypes: sanitization.detectedTypes,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // STEP 2: Layer 2 Zero-Trust Database Isolation
      const safeContext = projectPublicListingAttributes(activeListingForAI || undefined);

      // STEP 3: Layer 3 Governed Provider Dispatch
      const provider = getAIProvider(selectedProvider);
      const aiResponse = await provider.chat(sanitization.sanitizedText, safeContext);

      if (aiResponse.guardrailTriggered) {
        logSecurityEvent({
          eventType: 'PROMPT_INJECTION_BLOCKED',
          severity: 'HIGH',
          description: `Guardrail triggered under ${aiResponse.provider} provider`,
          maskedPayload: sanitization.sanitizedText.slice(0, 80),
          ipAddress: '10.24.118.42',
          actionTaken: 'LLM Response Constrained by Policy Gate',
        });
      }

      const assistantMsg: AIMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI chat failure:', err);
      const errMsg: AIMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'assistant',
        content:
          'LPUmart AI Service: A connection glitch occurred. The governed deterministic fallback engine has been preserved.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl h-[90vh] max-h-[720px] bg-[#111114] border border-[#27272A] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#09090B] border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9F43] flex items-center justify-center text-black font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">LPUmart Governed AI Agent</h3>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                  3-Layer Defended
                </span>
              </div>
              <span className="text-[11px] text-[#A1A1AA]">
                {activeListingForAI ? `Consulting on: ${activeListingForAI.title.slice(0, 32)}...` : 'General Marketplace Assistant'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Provider Selector */}
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="bg-[#18181B] border border-[#27272A] text-[11px] text-white rounded-lg px-2 py-1 font-mono focus:outline-none"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI GPT-4o</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="deterministic">Deterministic Engine</option>
            </select>

            <button
              onClick={closeAIModal}
              className="p-1.5 rounded-lg bg-[#18181B] text-[#A1A1AA] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FEE CONSENT GATE: Mandatory ₹5 Engagement Billing Disclosure */}
        {!feeAccepted && activeListingForAI ? (
          <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00]">
              <CreditCard className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md">
              <h4 className="text-xl font-bold text-white">AI Query Session Fee</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                As per LPUmart platform policy (§4.2), an engagement fee of{' '}
                <span className="text-white font-bold font-mono">₹5 per item-query session</span> is
                recorded. This supports real-time deterministic PII deflection and zero-trust
                database isolation.
              </p>
            </div>

            <div className="w-full max-w-sm p-4 rounded-xl bg-[#09090B] border border-[#27272A] text-left text-xs space-y-2">
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Target Listing:</span>
                <span className="text-white font-medium truncate max-w-[180px]">
                  {activeListingForAI.title}
                </span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Session Fee:</span>
                <span className="text-[#FF6B00] font-bold font-mono">₹5.00</span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Billing Mode:</span>
                <span className="text-white font-mono">Recorded to Student Ledger</span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Idempotency:</span>
                <span className="text-emerald-400 font-mono">Protected</span>
              </div>
            </div>

            <div className="flex gap-3 w-full max-w-sm">
              <button
                onClick={closeAIModal}
                className="flex-1 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptFeeAndStart}
                className="flex-1 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] text-black text-xs font-bold shadow-lg"
              >
                Accept & Start (₹5)
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Live Deflection Monitor Bar */}
            <div className="px-4 py-2 bg-[#09090B]/60 border-b border-[#27272A] text-[11px] flex items-center justify-between text-[#A1A1AA]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Trust Projection: Public attributes only. PII scrubbed.</span>
              </div>
              <span className="font-mono text-[#FF9F43]">Session: Active</span>
            </div>

            {/* Sanitization Alert Banner if triggered */}
            {lastSanitizationAlert && (
              <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{lastSanitizationAlert}</span>
              </div>
            )}

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#FF6B00] text-black font-medium'
                        : 'bg-[#18181B] text-[#FAFAFA] border border-[#27272A]'
                    }`}
                  >
                    {/* If user message had PII deflected, display badge */}
                    {msg.piiDeflected && (
                      <div className="mb-1 text-[10px] font-mono text-black/75 bg-black/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Layer 1 Deflected: Raw PII masked</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-[#71717A] mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#A1A1AA] bg-[#18181B] border border-[#27272A] px-3 py-2 rounded-xl w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
                  <span>Governed AI verifying safety boundaries...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Inquiries */}
            <div className="px-4 py-2 border-t border-[#27272A] bg-[#09090B] flex gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() =>
                  handleSendMessage('What is the item condition and what lab accessories are included?')
                }
                className="px-2.5 py-1 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[11px] text-[#A1A1AA] whitespace-nowrap"
              >
                Item condition & accessories
              </button>
              <button
                onClick={() =>
                  handleSendMessage('Where is the campus handshake point? Can we meet at Uni-Mall?')
                }
                className="px-2.5 py-1 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[11px] text-[#A1A1AA] whitespace-nowrap"
              >
                Campus meeting points
              </button>
              <button
                onClick={() =>
                  handleSendMessage('What are the rental rates and security deposit terms?')
                }
                className="px-2.5 py-1 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[11px] text-[#A1A1AA] whitespace-nowrap"
              >
                Rental terms & deposit
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#09090B] border-t border-[#27272A] flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about products, rental terms, or test PII deflection..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-[#111114] border border-[#27272A] rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF6B00]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="p-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] disabled:opacity-40 text-black transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
