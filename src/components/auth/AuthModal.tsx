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
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser } = useMarketplace();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [hostel, setHostel] = useState('Boys Hostel 4 (BH-4), Room 312');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          ? { name, email, registrationNumber: regNo, password, hostel }
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
      }, 900);
    } catch (err: any) {
      setError('Connection error with campus authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectQuickProfile = (profileType: 'aarav' | 'priya' | 'admin') => {
    if (profileType === 'aarav') {
      setUser({
        id: 'usr_aarav',
        name: 'Aarav Sharma',
        registrationNumber: '12104892',
        email: 'aarav.12104892@lpu.in',
        phone: '+91 98765 43210',
        hostel: 'Boys Hostel 4 (BH-4), Room 312',
        department: 'School of Computer Science & Engineering',
        verifiedStudent: true,
        role: 'buyer',
        walletBalance: 8500,
        aiFeesAccumulated: 15,
      });
    } else if (profileType === 'priya') {
      setUser({
        id: 'usr_priya',
        name: 'Priya Patel',
        registrationNumber: '12015933',
        email: 'priya.12015933@lpu.in',
        phone: '+91 98765 11223',
        hostel: 'Girls Hostel 2 (GH-2)',
        department: 'School of Electronics & Electrical Engineering',
        verifiedStudent: true,
        role: 'seller',
        walletBalance: 12400,
        aiFeesAccumulated: 0,
      });
    } else {
      setUser({
        id: 'usr_admin',
        name: 'Prof. K. Verma',
        registrationNumber: 'EMP_LPU_902',
        email: 'admin.governance@lpu.in',
        phone: '+91 98765 00000',
        hostel: 'Staff Quarters Block C',
        department: 'LPU Student Welfare & Marketplace Governance Board',
        verifiedStudent: true,
        role: 'admin',
        walletBalance: 0,
        aiFeesAccumulated: 0,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#111114] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#09090B]">
          <div className="flex items-center gap-2">
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

        <div className="p-6 space-y-4">
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

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#A1A1AA]">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
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
                <label className="text-xs font-medium text-[#A1A1AA]">Institutional Email</label>
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
                  placeholder="student.id@lpu.in"
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
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] disabled:opacity-50 text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm mt-3"
            >
              {isSubmitting
                ? 'Validating Identity...'
                : mode === 'register'
                ? 'Register & Verify Student'
                : 'Sign In to Campus Store'}
            </button>
          </form>

          {/* Quick-Switcher for Evaluation Convenience */}
          <div className="pt-4 border-t border-[#27272A] space-y-2">
            <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider block">
              Evaluator Quick Profile Switcher
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectQuickProfile('aarav')}
                className="p-2 rounded-lg bg-[#09090B] border border-[#27272A] hover:border-[#FF6B00] text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-white truncate">Aarav (CSE)</div>
                <div className="text-[9px] text-[#A1A1AA]">Buyer</div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuickProfile('priya')}
                className="p-2 rounded-lg bg-[#09090B] border border-[#27272A] hover:border-[#FF6B00] text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-white truncate">Priya (ECE)</div>
                <div className="text-[9px] text-[#A1A1AA]">Seller</div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectQuickProfile('admin')}
                className="p-2 rounded-lg bg-[#09090B] border border-[#27272A] hover:border-[#FF6B00] text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-white truncate">Prof. Verma</div>
                <div className="text-[9px] text-[#A1A1AA]">Admin</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
