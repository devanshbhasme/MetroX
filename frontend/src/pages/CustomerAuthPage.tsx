import React, { useState } from 'react';
import { AuthUser, CustomerSignUpPayload, CustomerSignInPayload } from '../types/metro';
import { api } from '../services/api';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Sparkles, 
  GraduationCap, 
  Heart, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

interface CustomerAuthPageProps {
  onAuthSuccess: (user: AuthUser, token: string) => void;
  onNavigateHome: () => void;
  initialMode?: 'signin' | 'signup';
}

export const CustomerAuthPage: React.FC<CustomerAuthPageProps> = ({
  onAuthSuccess,
  onNavigateHome,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpCategory, setSignUpCategory] = useState<'Regular' | 'Student' | 'Senior'>('Regular');
  const [collegeName, setCollegeName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [seniorAge, setSeniorAge] = useState<number>(65);
  const [seniorId, setSeniorId] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: CustomerSignInPayload = {
        email: signInEmail.trim(),
        password: signInPassword
      };
      const res = await api.customerSignIn(payload);
      onAuthSuccess(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Validate Senior Aadhaar and Age
    if (signUpCategory === 'Senior') {
      const cleanAadhaar = seniorId.replace(/\D/g, '');
      if (cleanAadhaar.length !== 12) {
        setError('Senior citizen registration requires a valid 12-digit Aadhaar Card number for age verification.');
        setLoading(false);
        return;
      }
      if (seniorAge < 60) {
        setError('Age verification failed: Senior citizen concession strictly requires age 60 or above as per Aadhaar Card.');
        setLoading(false);
        return;
      }
    }

    // Validate Student Institutional Email
    if (signUpCategory === 'Student') {
      const isEdu = signUpEmail.includes('@') && /(\.edu|\.ac\.in|\.ac|\.edu\.in)/i.test(signUpEmail);
      if (!isEdu) {
        setError('Student registration requires a valid institutional email ending in .edu or .ac.in.');
        setLoading(false);
        return;
      }
    }

    try {
      const payload: CustomerSignUpPayload = {
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        phone: signUpPhone.trim(),
        password: signUpPassword,
        category: signUpCategory,
        collegeName: signUpCategory === 'Student' ? collegeName.trim() : undefined,
        studentId: signUpCategory === 'Student' ? studentId.trim() : undefined,
        age: signUpCategory === 'Senior' ? seniorAge : undefined,
        seniorId: signUpCategory === 'Senior' ? seniorId.trim() : undefined
      };

      const res = await api.customerSignUp(payload);
      onAuthSuccess(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = (email: string, pass: string) => {
    setSignInEmail(email);
    setSignInPassword(pass);
    setError(null);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <ScrollReveal direction="down" duration={0.4}>
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0047BA] to-blue-700 text-white flex items-center justify-center mx-auto shadow-md">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            MetroX Commuter Account
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Access cashless smart ticketing, track journey passes, and enjoy category concessions.
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`w-1/2 py-2.5 rounded-xl font-bold text-xs transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#0047BA] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In to Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`w-1/2 py-2.5 rounded-xl font-bold text-xs transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#0047BA] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {mode === 'signin' ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. david.chen@univ.edu"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium text-xs transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium text-xs transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#0047BA] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Commuter Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Credentials Helper */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Quick Demo Accounts (1-Click Fill):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => fillDemoCustomer('david.chen@univ.edu', 'metro123')}
                    className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-left font-medium border border-blue-200 transition"
                  >
                    <div className="font-bold flex items-center space-x-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>David Chen</span>
                    </div>
                    <span className="text-[10px] text-blue-600/80">Student • 20% Concession</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoCustomer('r.wilson@seniorcare.org', 'metro123')}
                    className="p-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-left font-medium border border-purple-200 transition"
                  >
                    <div className="font-bold flex items-center space-x-1">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Robert Wilson</span>
                    </div>
                    <span className="text-[10px] text-purple-600/80">Senior • 30% Concession</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ================= SIGN UP FORM ================= */
            <form onSubmit={handleSignUp} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-[11px] font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>New commuter registration includes a ₹100 welcome transit wallet balance!</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {signUpCategory === 'Student' ? 'Student Institutional Email (.edu / .ac.in)' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder={signUpCategory === 'Student' ? "student@univ.edu or name@college.ac.in" : "priya@example.com"}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Set Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs"
                  />
                </div>
              </div>

              {/* Passenger Category Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Concession Category</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignUpCategory('Regular')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      signUpCategory === 'Regular'
                        ? 'border-blue-600 bg-blue-50 text-[#0047BA] font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <User className="w-4 h-4 mx-auto mb-1" />
                    <span className="block text-[11px]">Regular</span>
                    <span className="text-[10px] text-slate-400 font-normal">Standard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpCategory('Student')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      signUpCategory === 'Student'
                        ? 'border-blue-600 bg-blue-50 text-[#0047BA] font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <span className="block text-[11px]">Student</span>
                    <span className="text-[10px] text-emerald-600 font-bold">20% OFF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpCategory('Senior')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      signUpCategory === 'Senior'
                        ? 'border-blue-600 bg-blue-50 text-[#0047BA] font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Heart className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span className="block text-[11px]">Senior</span>
                    <span className="text-[10px] text-emerald-600 font-bold">30% OFF</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Concession Fields */}
              {signUpCategory === 'Student' && (
                <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2.5 animate-in fade-in duration-150">
                  <div className="font-bold text-[#0047BA] text-[11px] flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Student Verification Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="College / University Name"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Student ID Card Number"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                  </div>
                </div>
              )}

              {signUpCategory === 'Senior' && (
                <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2.5 animate-in fade-in duration-150">
                  <div className="font-bold text-purple-800 text-[11px] flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Senior Citizen Verification Details</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Verified Age (Min 60)</label>
                      <input
                        type="number"
                        min={60}
                        max={110}
                        required
                        value={seniorAge}
                        onChange={(e) => setSeniorAge(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Aadhaar Card UID (12-Digit)</label>
                      <input
                        type="text"
                        required
                        placeholder="5421 8890 1234"
                        value={seniorId}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                          setSeniorId(val.replace(/(\d{4})/g, '$1 ').trim());
                        }}
                        maxLength={14}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-purple-700">
                    Aadhaar card verification is mandatory to confirm minimum age eligibility of 60 years.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Creating Profile...' : 'Complete Registration & Get ₹100 Card'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Bottom Navigation Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-slate-500 hover:text-slate-800 font-medium"
            >
              ← Back to Dashboard
            </button>
            <span className="text-[11px] text-slate-400">
              Data saved securely in project <code className="text-slate-600">server/data/users.json</code>
            </span>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
