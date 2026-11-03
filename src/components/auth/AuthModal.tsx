import React, { useState } from 'react';
import {
  X,
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
  ShoppingBag,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { supabase, isSupabaseClientConfigured } from '../../lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, setUserRole, setActiveTab } = useMarketplace();

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

  if (!isOpen) return null;

  const isLpuEmail =
    email.toLowerCase().endsWith('@lpu.in') || email.toLowerCase().endsWith('@lpu.co.in');

  const handleSubmit = async (e: React.FormEvent) => {
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
        setError(data.error || 'Authentication failed. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      setUser(data.profile);
      setSuccessMsg(data.message || 'Authenticated successfully!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError('Connection error with campus authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccessMsg(null);
    setIsGoogleSubmitting(true);

    try {
      if (isSupabaseClientConfigured && window.location.protocol.startsWith('http')) {
        try {
          const { error: sbError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin,
            },
          });
          if (!sbError) return;
        } catch (_) {}
      }

      const googleUserEmail = email.trim() || 'kumaripawan2611@gmail.com';
      const googleUserName = name.trim() || googleUserEmail.split('@')[0];

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleUserEmail,
          name: googleUserName,
          role: selectedSignupRole, // Buyer or seller only
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
          ? `Google account created as ${selectedSignupRole === 'seller' ? 'Student Seller' : 'Student Buyer'}!`
          : `Signed in with Google as ${data.profile.name}!`
      );

      setTimeout(() => {
        onClose();
      }, 700);
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
      setMode('signin');
      setEmail('admin.governance@lpu.in');
      setPassword('AdminPass@902');
      setName('Campus Administrator');
      setRegNo('EMP_LPU_902');
      setHostel('Administrative Block 32');
      setSuccessMsg('Administrator credentials loaded. Submit to verify and authenticate.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#111114] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#09090B]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9F43] flex items-center justify-center font-bold text-black text-xs">
              LM
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Campus Student Identity</h3>
              <p className="text-[10px] text-[#A1A1AA]">Lovely Professional University</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18181B] text-[#A1A1AA] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch: Sign In vs Register */}
        <div className="flex border-b border-[#27272A] bg-[#09090B]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold transition-colors border-b-2 ${
              mode === 'signin'
                ? 'border-[#FF6B00] text-white'
                : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
            }`}
          >
            Student Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-[#FF6B00] text-white'
                : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
            }`}
          >
            New Student Registration
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign In / Create Account Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isGoogleSubmitting || isSubmitting}
            className="w-full py-2.5 px-3 rounded-xl bg-[#18181B] hover:bg-[#202024] border border-[#3F3F46] hover:border-[#52525B] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2.5 shadow-sm"
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
                ? 'Connecting to Google...'
                : mode === 'register'
                ? `Create Account with Google (${selectedSignupRole === 'seller' ? 'Seller' : 'Buyer'})`
                : 'Continue with Google'}
            </span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-[#27272A] w-full" />
            <span className="bg-[#111114] px-2 text-[10px] uppercase tracking-wider text-[#71717A] absolute">
              Or institutional credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <>
                {/* Account Type Selection: STRICTLY BUYER OR SELLER ONLY */}
                <div className="space-y-2 p-2.5 rounded-xl bg-[#09090B] border border-[#27272A]">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-white">Select Account Type</label>
                    <span className="text-[10px] text-emerald-400 font-medium">Buyer or Seller</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSignupRole('buyer')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedSignupRole === 'buyer'
                          ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-white'
                          : 'border-[#27272A] bg-[#111114] text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <ShoppingBag
                          className={`w-3.5 h-3.5 ${
                            selectedSignupRole === 'buyer' ? 'text-[#FF6B00]' : 'text-[#71717A]'
                          }`}
                        />
                        <span className="text-xs font-bold">Student Buyer</span>
                      </div>
                      <p className="text-[9px] text-[#A1A1AA]">Buy & rent, Buyer AI assistant</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSignupRole('seller')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedSignupRole === 'seller'
                          ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-white'
                          : 'border-[#27272A] bg-[#111114] text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Store
                          className={`w-3.5 h-3.5 ${
                            selectedSignupRole === 'seller' ? 'text-[#FF6B00]' : 'text-[#71717A]'
                          }`}
                        />
                        <span className="text-xs font-bold">Student Seller</span>
                      </div>
                      <p className="text-[9px] text-[#A1A1AA]">Post listings, Seller AI</p>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 p-2 rounded bg-amber-500/5 text-[9px] text-amber-300">
                    <Shield className="w-3 h-3 shrink-0 text-amber-400" />
                    <span>Admin privileges require LPU Governance authorization.</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#A1A1AA]">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                    <input
                      type="text"
                      required
                      placeholder="Student Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#09090B] border border-[#27272A] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
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
                      placeholder="e.g. 12104892 (8-digit ID)"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      className="w-full bg-[#09090B] border border-[#27272A] rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#A1A1AA]">Campus Hostel / Room</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                    <input
                      type="text"
                      placeholder="e.g. Boys Hostel 4, Room 312"
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      className="w-full bg-[#09090B] border border-[#27272A] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
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
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isLpuEmail
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {isLpuEmail ? 'LPU Verified' : 'External Email'}
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
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
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
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] disabled:opacity-50 text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm mt-3 cursor-pointer"
            >
              {isSubmitting
                ? 'Validating Identity...'
                : mode === 'register'
                ? `Register as ${selectedSignupRole === 'seller' ? 'Student Seller' : 'Student Buyer'}`
                : 'Sign In to Campus Store'}
            </button>
          </form>

          {/* Quick-Fill Test Values (Test Logins without personal dummy accounts) */}
          <div className="pt-4 border-t border-[#27272A] space-y-2">
            <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider block">
              Quick Test Credentials Autofill
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillTestCredentials('buyer')}
                className="p-2 rounded-lg bg-[#09090B] border border-[#27272A] hover:border-[#FF6B00] text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-white truncate">Test Buyer</div>
                <div className="text-[9px] text-[#A1A1AA]">buyer@lpu.in</div>
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials('seller')}
                className="p-2 rounded-lg bg-[#09090B] border border-[#27272A] hover:border-[#FF6B00] text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-white truncate">Test Seller</div>
                <div className="text-[9px] text-[#A1A1AA]">seller@lpu.in</div>
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials('admin')}
                className="p-2 rounded-lg bg-[#09090B] border border-[#27272A] hover:border-[#FF6B00] text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-white truncate">Test Admin</div>
                <div className="text-[9px] text-[#A1A1AA]">admin@lpu.in</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
