import React, { useState, useEffect } from 'react';
import { UserProfile, Station, Ticket } from '../types/metro';
import { api } from '../services/api';
import { User, CreditCard, Heart, Bell, Leaf, CheckCircle2, Save, Smartphone } from 'lucide-react';

interface ProfilePageProps {
  stations: Station[];
  tickets: Ticket[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ stations, tickets }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rechargeAmt, setRechargeAmt] = useState(200);
  const [rechargeSuccess, setRechargeSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => null);
  }, []);

  const handleRecharge = async () => {
    if (!profile) return;
    const newBal = profile.cardBalance + rechargeAmt;
    const updated = { ...profile, cardBalance: parseFloat(newBal.toFixed(2)) };
    setProfile(updated);
    await api.updateProfile(updated);
    setRechargeSuccess(true);
    setTimeout(() => setRechargeSuccess(false), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await api.updateProfile(profile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save profile');
    }
  };

  if (!profile) {
    return <div className="py-12 text-center text-xs text-slate-400">Loading profile...</div>;
  }

  const completedTrips = tickets.filter(t => t.bookingStatus === 'CONFIRMED').length;
  const carbonSavedKg = (completedTrips * 1.8).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047BA] flex items-center justify-center border border-blue-200">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Profile & Commuter Preferences</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your transit account, view registered smart cards, and configure daily journey preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Smart Card & Balance Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white shadow-lg space-y-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm tracking-wider">MetroX SmartCard</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded">
                ACTIVE
              </span>
            </div>

            <div className="font-mono text-sm tracking-widest text-slate-200">
              {profile.smartCardNumber}
            </div>

            <div className="flex items-end justify-between pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Stored Value Balance</span>
                <span className="text-2xl font-black text-emerald-400">₹{profile.cardBalance.toFixed(2)}</span>
              </div>
              <CreditCard className="w-8 h-8 text-white/40" />
            </div>
          </div>

          {/* Quick Balance Recharge */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-[#0047BA]" />
              <span>Instant Card Recharge (Simulated)</span>
            </h4>

            {rechargeSuccess && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Card credited ₹{rechargeAmt} successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setRechargeAmt(amt)}
                  className={`py-1.5 rounded-lg border font-semibold transition ${
                    rechargeAmt === amt
                      ? 'border-[#0047BA] bg-blue-50 text-[#0047BA]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handleRecharge}
              className="w-full py-2 bg-[#0047BA] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Top-Up ₹{rechargeAmt}
            </button>
          </div>

          {/* Eco Impact Stats */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Eco-Transit Contribution</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              By completing {completedTrips} metro rides, you have prevented approximately <strong>{carbonSavedKg} kg</strong> of vehicle CO2 emissions in the city.
            </p>
          </div>
        </div>

        {/* Right 2 Cols: Profile Form & Notification Toggles */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Account Details</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0047BA] border border-blue-200">
                {profile.type} Passenger
              </span>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile preferences updated successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Corridor</label>
                <select
                  value={profile.preferredLine}
                  onChange={(e) => setProfile({ ...profile, preferredLine: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Orange Line">Orange Line (North-South)</option>
                  <option value="Aqua Line">Aqua Line (East-West)</option>
                </select>
              </div>
            </div>

            {/* Favorite Stations */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Frequent Journey Stations</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Home Station</label>
                  <select
                    value={profile.homeStationId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const st = stations.find(s => s.id === id);
                      setProfile({ ...profile, homeStationId: id, homeStationName: st ? st.name : '' });
                    }}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {stations.map(s => <option key={s.id} value={s.id}>#{s.id} {s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Work / College Station</label>
                  <select
                    value={profile.workStationId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const st = stations.find(s => s.id === id);
                      setProfile({ ...profile, workStationId: id, workStationName: st ? st.name : '' });
                    }}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {stations.map(s => <option key={s.id} value={s.id}>#{s.id} {s.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                <Bell className="w-3.5 h-3.5 text-[#0047BA]" />
                <span>Real-Time Alert Notifications</span>
              </h4>

              <div className="space-y-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.notificationSettings.delays}
                    onChange={(e) => setProfile({
                      ...profile,
                      notificationSettings: { ...profile.notificationSettings, delays: e.target.checked }
                    })}
                    className="w-4 h-4 text-[#0047BA] rounded"
                  />
                  <span className="text-slate-700">Receive instant push notifications for line delays & advisories</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.notificationSettings.platformChanges}
                    onChange={(e) => setProfile({
                      ...profile,
                      notificationSettings: { ...profile.notificationSettings, platformChanges: e.target.checked }
                    })}
                    className="w-4 h-4 text-[#0047BA] rounded"
                  />
                  <span className="text-slate-700">Platform change announcements at Sitabuldi Interchange</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0047BA] hover:bg-blue-600 text-white font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
