import React, { useState } from 'react';
import { Users, UserPlus, CheckCircle2, AlertCircle, GraduationCap, HeartHandshake, User } from 'lucide-react';
import { Passenger } from '../types/metro';
import { api } from '../services/api';

interface PassengersPageProps {
  passengers: Passenger[];
  onRefresh: () => void;
}

export const PassengersPage: React.FC<PassengersPageProps> = ({ passengers, onRefresh }) => {
  const [passengerType, setPassengerType] = useState<'REGULAR' | 'STUDENT' | 'SENIOR'>('REGULAR');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [studentCardId, setStudentCardId] = useState('');
  const [age, setAge] = useState<number>(65);
  const [seniorCardId, setSeniorCardId] = useState('');

  const [registering, setRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setRegistering(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await api.registerPassenger({
        type: passengerType,
        name: name.trim(),
        email: email.trim(),
        collegeName: passengerType === 'STUDENT' ? collegeName.trim() : undefined,
        studentCardId: passengerType === 'STUDENT' ? studentCardId.trim() : undefined,
        age: passengerType === 'SENIOR' ? Number(age) : undefined,
        seniorCardId: passengerType === 'SENIOR' ? seniorCardId.trim() : undefined,
      });

      setSuccessMsg(`Passenger '${name.trim()}' registered successfully with ID #${res.id}!`);
      setName('');
      setEmail('');
      setCollegeName('');
      setStudentCardId('');
      setSeniorCardId('');
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#0047BA] uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          <span>Polymorphic Concession Registry</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Passenger Directory</h1>
        <p className="text-sm text-[#64748B]">
          Encapsulated C++ polymorphic passenger hierarchy with runtime discount computation (0% Regular, 20% Student, 30% Senior Citizen).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Registration Form */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0047BA] flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Register New Commuter</h3>
              <p className="text-xs text-[#64748B]">Instantiates std::unique_ptr&lt;Passenger&gt;</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Category Select Radio */}
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1.5">Concession Category</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPassengerType('REGULAR')}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition ${
                    passengerType === 'REGULAR'
                      ? 'border-[#0047BA] bg-[#0047BA] text-white'
                      : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Regular
                </button>

                <button
                  type="button"
                  onClick={() => setPassengerType('STUDENT')}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition ${
                    passengerType === 'STUDENT'
                      ? 'border-[#0047BA] bg-[#0047BA] text-white'
                      : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Student (20%)
                </button>

                <button
                  type="button"
                  onClick={() => setPassengerType('SENIOR')}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition ${
                    passengerType === 'SENIOR'
                      ? 'border-[#0047BA] bg-[#0047BA] text-white'
                      : 'border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Senior (30%)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex Morgan"
                required
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:border-[#0047BA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., alex@transit.org"
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:border-[#0047BA]"
              />
            </div>

            {/* Dynamic Student Fields */}
            {passengerType === 'STUDENT' && (
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#0047BA] mb-1">College / University Name</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g., National Institute of Tech"
                    required
                    className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#0047BA] mb-1">Student Card ID</label>
                  <input
                    type="text"
                    value={studentCardId}
                    onChange={(e) => setStudentCardId(e.target.value)}
                    placeholder="e.g., STU-9921"
                    required
                    className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* Dynamic Senior Citizen Fields */}
            {passengerType === 'SENIOR' && (
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-amber-800 mb-1">Age (Must be 60+)</label>
                  <input
                    type="number"
                    min="60"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    required
                    className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-amber-800 mb-1">Senior ID Card Number</label>
                  <input
                    type="text"
                    value={seniorCardId}
                    onChange={(e) => setSeniorCardId(e.target.value)}
                    placeholder="e.g., SR-55100"
                    required
                    className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-2.5 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={registering || !name.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0047BA] hover:bg-[#003994] disabled:bg-slate-300 text-white font-semibold text-xs shadow-sm transition"
            >
              {registering ? 'Creating Record...' : 'Register Commuter'}
            </button>
          </form>
        </div>

        {/* Passenger Directory Table */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-sm text-[#0F172A] mb-4">Registered Commuters ({passengers.length} Total)</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Commuter</th>
                  <th className="py-3 px-4">Concession Category</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Verification Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {passengers.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC] transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#0047BA]">#{p.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0F172A]">{p.name}</div>
                      <span className="text-[11px] text-[#64748B]">{p.email || '—'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                        p.type === 'Student' 
                          ? 'bg-blue-50 text-[#0047BA] border border-blue-200' 
                          : p.type === 'Senior Citizen'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-[#334155]'
                      }`}>
                        {p.type === 'Student' && <GraduationCap className="w-3 h-3" />}
                        {p.type === 'Senior Citizen' && <HeartHandshake className="w-3 h-3" />}
                        {p.type === 'Regular' && <User className="w-3 h-3" />}
                        <span>{p.type}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {p.discountPercent > 0 ? `${p.discountPercent}% OFF` : '0%'}
                    </td>
                    <td className="py-3 px-4 text-[#64748B]">
                      {p.collegeName && (
                        <div>{p.collegeName} <span className="font-mono text-[#0F172A]">({p.studentCardId})</span></div>
                      )}
                      {p.age && (
                        <div>Age: {p.age} yrs <span className="font-mono text-[#0F172A]">({p.seniorCardId})</span></div>
                      )}
                      {!p.collegeName && !p.age && 'Standard Profile'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
