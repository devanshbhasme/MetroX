import React, { useState } from 'react';
import { AuthUser, AdminSignInPayload } from '../types/metro';
import { api } from '../services/api';
import { 
  Shield, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  AlertCircle,
  Terminal
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

interface AdminSignInPageProps {
  onAdminAuthSuccess: (user: AuthUser, token: string) => void;
  onReturnToPassenger: () => void;
}

export const AdminSignInPage: React.FC<AdminSignInPageProps> = ({
  onAdminAuthSuccess,
  onReturnToPassenger
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: AdminSignInPayload = {
        email: email.trim(),
        password,
        securityKey: securityKey.trim() || undefined
      };
      const res = await api.adminSignIn(payload);
      onAdminAuthSuccess(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Authorization failed. Invalid credentials or clearance key.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@metrox.gov');
    setPassword('admin123');
    setSecurityKey('metrox2026');
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <ScrollReveal direction="down" duration={0.45}>
        {/* Terminal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex items-center justify-center mx-auto shadow-lg border border-purple-500/30">
            <Shield className="w-7 h-7 text-purple-300" />
          </div>
          
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-[10px] font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
            <span>RESTRICTED TRANSIT AUTHORITY CONSOLE</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Administrator Clearance
          </h1>
          <p className="text-xs text-slate-500">
            Enter supervisory credentials to manage train fleets, stations, fares, and financial ledger.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Authority Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <form onSubmit={handleAdminSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Official Authority Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@metrox.gov"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium text-xs transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Administrative Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium text-xs transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-semibold text-slate-700">Security Clearance Key</label>
                <span className="text-[10px] text-slate-400">Optional for demo</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="e.g. metrox2026"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium text-xs transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Clearance...' : 'Authenticate & Unlock Authority Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Credentials */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Fill Demo Admin Credentials (admin@metrox.gov)</span>
              </button>
            </div>
          </form>

          {/* Fallback to Passenger Section */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onReturnToPassenger}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← Not an Administrator? Return to Passenger Portal
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
