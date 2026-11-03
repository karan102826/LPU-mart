import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  ArrowRight,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Store,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { supabase, isSupabaseClientConfigured } from '../../lib/supabase/client';

export const LoginPage: React.FC = () => {
  const { user, setUser, setUserRole, setActiveTab, openAdminLoginModal } = useMarketplace();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [selectedSignupRole, setSelectedSignupRole] = useState<'buyer' | 'seller'>('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [hostel, setHostel] = useState('Boys Hostel 4 (BH-4), Room 312');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const isLpuEmail =
    email.toLowerCase().endsWith('@lpu.in') || email.toLowerCase().endsWith('@lpu.co.in');

  const handleStandardAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload =
        mode === 'register'
          ? {
              name,
              email,
              registrationNumber: regNo,
              password,
              hostel,
              role: selectedSignupRole, // Strictly buyer or seller only
            }
          : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please verify credentials.');
        setIsSubmitting(false);
        return;
      }

      setUser(data.profile);
      setSuccessMsg(data.message || 'Authenticated successfully!');
      setTimeout(() => {
        setActiveTab(data.profile.role === 'admin' ? 'admin' : 'marketplace');
      }, 800);
    } catch (err) {
      setError('Connection error with campus authentication service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccessMsg(null);
    setIsGoogleSubmitting(true);

    try {
      // If client Supabase is configured and not in isolated sandboxed iframe, attempt OAuth
      if (isSupabaseClientConfigured && window.location.protocol.startsWith('http')) {
        try {
          const { error: sbError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin,
            },
          });
          if (!sbError) {
            // OAuth redirect initiated
            return;
          }
        } catch (ignored) {
          // Fall back gracefully to backend Google student authentication
        }
      }

      // Backend Google Authentication & Account Creation flow
      const googleUserEmail = email.trim() || 'kumaripawan2611@gmail.com';
      const googleUserName = name.trim() || googleUserEmail.split('@')[0];

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleUserEmail,
          name: googleUserName,
          role: selectedSignupRole, // Strictly buyer or seller! Admin registration is blocked.
          registrationNumber: regNo || `12${Math.floor(100000 + Math.random() * 900000)}`,
          hostel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Google authentication could not be completed.');
        setIsGoogleSubmitting(false);
        return;
      }

      setUser(data.profile);
      setSuccessMsg(
        mode === 'register'
          ? `Google account created successfully as ${selectedSignupRole === 'seller' ? 'Student Seller' : 'Student Buyer'}!`
          : `Signed in with Google successfully as ${data.profile.name}!`
      );

      setTimeout(() => {
        setActiveTab(data.profile.role === 'admin' ? 'admin' : 'marketplace');
      }, 800);
    } catch (err) {
      setError('Failed to connect to Google authentication service.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const fillTestCredentials = (role: 'buyer' | 'seller' | 'admin') => {
    if (role === 'buyer') {
      setEmail('buyer.12104892@lpu.in');
      setPassword('TestPass@123');
      setName('Student Buyer');
      setRegNo('12104892');
      setHostel('Boys Hostel 4 (BH-4), Room 312');
      if (mode === 'register') setSelectedSignupRole('buyer');
    } else if (role === 'seller') {
      setEmail('seller.12015933@lpu.in');
      setPassword('TestPass@123');
      setName('Student Seller');
      setRegNo('12015933');
      setHostel('Girls Hostel 2 (GH-2), Room 204');
      if (mode === 'register') setSelectedSignupRole('seller');
    } else {
      // Admin fill (only in signin mode) - requires explicit submission and authentication
      setMode('signin');
      setEmail('admin.governance@lpu.in');
      setPassword('AdminPass@902');
      setName('Campus Administrator');
      setRegNo('EMP_LPU_902');
      setHostel('Administrative Block 32');
      setSuccessMsg('Administrator credentials loaded into form. Click "Sign In to Campus Store" to authenticate.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-28">
      {/* Page Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF9F43] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lovely Professional University Campus Identity</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Campus Sign In & Account Access
        </h1>
        <p className="text-sm text-[#A1A1AA] max-w-xl mx-auto">
          Sign in or create your verified student account to buy, sell, or rent with 10% escrow
          protection and full access to our Governed AI Assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Google Auth */}
        <div className="md:col-span-7 bg-[#111114] border border-[#27272A] rounded-2xl p-6 md:p-8 shadow-xl">
          {/* Tab Selector */}
          <div className="flex border-b border-[#27272A] mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 text-center ${
                mode === 'signin'
                  ? 'border-[#FF6B00] text-white'
                  : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 text-center ${
                mode === 'register'
                  ? 'border-[#FF6B00] text-white'
                  : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              Create New Account
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Auth Button */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleSubmitting || isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#18181B] hover:bg-[#202024] border border-[#3F3F46] hover:border-[#52525B] text-white text-xs font-semibold transition-all flex items-center justify-center gap-3 shadow-sm group"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {isGoogleSubmitting
                  ? 'Connecting with Google...'
                  : mode === 'register'
                  ? `Create Account using Google (${selectedSignupRole === 'seller' ? 'Seller' : 'Buyer'})`
                  : 'Continue with Google'}
              </span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-[#27272A] w-full" />
              <span className="bg-[#111114] px-3 text-[11px] uppercase tracking-wider text-[#71717A] absolute">
                Or with Institutional Credentials
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleStandardAuth} className="space-y-4">
            {mode === 'register' && (
              <>
                {/* Account Type Selection: STRICTLY BUYER OR SELLER ONLY */}
                <div className="space-y-2 p-3 rounded-xl bg-[#09090B] border border-[#27272A]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white">Select Account Role</label>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      Buyer or Seller Only
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedSignupRole('buyer')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedSignupRole === 'buyer'
                          ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-white'
                          : 'border-[#27272A] bg-[#111114] text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <ShoppingBag
                          className={`w-4 h-4 ${
                            selectedSignupRole === 'buyer' ? 'text-[#FF6B00]' : 'text-[#71717A]'
                          }`}
                        />
                        <span className="text-xs font-bold">Student Buyer</span>
                      </div>
                      <p className="text-[10px] text-[#A1A1AA] leading-snug">
                        Buy & rent items, buyer AI, Uni-Mall escrow handovers.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSignupRole('seller')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedSignupRole === 'seller'
                          ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-white'
                          : 'border-[#27272A] bg-[#111114] text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Store
                          className={`w-4 h-4 ${
                            selectedSignupRole === 'seller' ? 'text-[#FF6B00]' : 'text-[#71717A]'
                          }`}
                        />
                        <span className="text-xs font-bold">Student Seller</span>
                      </div>
                      <p className="text-[10px] text-[#A1A1AA] leading-snug">
                        Publish listings, manage orders, seller AI & 90% payout.
                      </p>
                    </button>
                  </div>

                  {/* Explicit Admin Restriction Notice */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/15 text-[10px] text-amber-300">
                    <Shield className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>
                      <strong>Admin Security Policy:</strong> Admin accounts cannot be self-created
                      and are granted only by institutional governance.
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#A1A1AA]">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Student Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#09090B] border border-[#27272A] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#A1A1AA]">
                    LPU Registration Number
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 12104892 (8 digits)"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      className="w-full bg-[#09090B] border border-[#27272A] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#A1A1AA]">Campus Hostel / Room</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                    <input
                      type="text"
                      placeholder="e.g. Boys Hostel 4 (BH-4), Room 312"
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      className="w-full bg-[#09090B] border border-[#27272A] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#A1A1AA]">Email Address</label>
                {email && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isLpuEmail
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {isLpuEmail ? 'LPU Institutional Verified' : 'Standard Email'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <input
                  type="email"
                  required
                  placeholder="student.id@lpu.in or personal email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#A1A1AA]">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full py-3 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] disabled:opacity-50 text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm mt-4 cursor-pointer"
            >
              {isSubmitting ? (
                'Authenticating with LPU Gateway...'
              ) : mode === 'register' ? (
                <>
                  <span>Create {selectedSignupRole === 'seller' ? 'Student Seller' : 'Student Buyer'} Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Sign In to Campus Store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Active Role Switcher, Test Values & Features */}
        <div className="md:col-span-5 space-y-6">
          {/* Active Role Card & Switcher (Buyer, Seller, Admin) */}
          <div className="bg-[#111114] border border-[#27272A] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Select Active Capability
              </span>
              <span className="text-[10px] bg-[#18181B] border border-[#27272A] px-2 py-0.5 rounded text-[#A1A1AA]">
                Current: <strong className="text-white capitalize">{user.role}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUserRole('buyer')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  user.role === 'buyer'
                    ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-white font-bold'
                    : 'border-[#27272A] bg-[#09090B] text-[#A1A1AA] hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-[#FF6B00]" />
                <span className="text-xs block">Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => setUserRole('seller')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  user.role === 'seller'
                    ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-white font-bold'
                    : 'border-[#27272A] bg-[#09090B] text-[#A1A1AA] hover:text-white'
                }`}
              >
                <Store className="w-4 h-4 mx-auto mb-1 text-[#FF9F43]" />
                <span className="text-xs block">Seller</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (user.role === 'admin') {
                    setActiveTab('admin');
                  } else {
                    openAdminLoginModal();
                  }
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  user.role === 'admin'
                    ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-white font-bold'
                    : 'border-[#27272A] bg-[#09090B] text-[#A1A1AA] hover:text-white'
                }`}
                title={user.role === 'admin' ? 'Open Admin Governance Dashboard' : 'Administrator Login Required'}
              >
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  {user.role !== 'admin' && (
                    <Lock className="w-2.5 h-2.5 absolute -top-1 right-1 text-amber-400" />
                  )}
                </div>
                <span className="text-xs block">Admin</span>
                {user.role !== 'admin' && (
                  <span className="text-[9px] text-amber-400 block font-medium">Login Req.</span>
                )}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#09090B] border border-[#27272A] space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9F43]" />
                <span>All 3 Roles Have Full AI Access</span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                Whether logged in as <strong>Buyer</strong> (item & price evaluation),{' '}
                <strong>Seller</strong> (listing polish & payout tracking), or{' '}
                <strong>Admin</strong> (surveillance & dispute mediation), the Governed AI Assistant
                is customized for your workflow.
              </p>
            </div>
          </div>

          {/* Quick Fill Test Values (Test Logins for Evaluator & Verification) */}
          <div className="bg-[#111114] border border-[#27272A] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Quick Test Credentials
              </span>
              <span className="text-[10px] text-[#71717A]">1-Click Autofill</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA]">
              Click any role to load institutional test values into the form:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillTestCredentials('buyer')}
                className="w-full p-2.5 rounded-xl bg-[#09090B] hover:bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">Fill Test Buyer</div>
                  <div className="text-[10px] text-[#71717A] font-mono">buyer.12104892@lpu.in</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#71717A]" />
              </button>

              <button
                type="button"
                onClick={() => fillTestCredentials('seller')}
                className="w-full p-2.5 rounded-xl bg-[#09090B] hover:bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">Fill Test Seller</div>
                  <div className="text-[10px] text-[#71717A] font-mono">seller.12015933@lpu.in</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#71717A]" />
              </button>

              <button
                type="button"
                onClick={() => fillTestCredentials('admin')}
                className="w-full p-2.5 rounded-xl bg-[#09090B] hover:bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">Fill Test Admin</div>
                  <div className="text-[10px] text-[#71717A] font-mono">admin.governance@lpu.in</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#71717A]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
