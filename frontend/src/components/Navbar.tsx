import React, { useState } from 'react';
import { 
  Train as TrainIcon, 
  MapPin, 
  Ticket as TicketIcon, 
  Users, 
  Activity, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ShieldAlert,
  Compass,
  Clock,
  Calculator,
  Building2,
  BarChart3,
  GitFork,
  LogOut,
  RotateCcw,
  User,
  Shield,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export type RoleType = 'passenger' | 'admin';

interface NavbarProps {
  role: RoleType;
  setRole: (role: RoleType) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  setRole,
  currentTab,
  setCurrentTab,
  onRefresh
}) => {
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.saveSystemData();
      showNotification(res.message || 'System data saved to data/*.txt', 'success');
      onRefresh();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save data', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async () => {
    setSaving(true);
    try {
      const res = await api.loadSystemData();
      showNotification(res.message || 'System data loaded from data/*.txt', 'success');
      onRefresh();
    } catch (err: any) {
      showNotification(err.message || 'Failed to load data', 'error');
    } finally {
      setSaving(false);
    }
  };

  const passengerNavItems = [
    { id: 'passenger-dashboard', label: 'Dashboard', icon: Activity },
    { id: 'passenger-booking', label: 'Book Ticket', icon: TicketIcon },
    { id: 'passenger-cancel', label: 'Cancel Ticket', icon: RotateCcw },
    { id: 'passenger-tickets', label: 'My Tickets', icon: TicketIcon },
    { id: 'passenger-map', label: 'Metro Map', icon: Compass },
    { id: 'passenger-routes', label: 'Routes & Transfers', icon: GitFork },
    { id: 'passenger-schedules', label: 'Timings', icon: Clock },
    { id: 'passenger-fares', label: 'Check Fare', icon: Calculator },
    { id: 'passenger-facilities', label: 'Facilities', icon: Building2 },
    { id: 'passenger-alerts', label: 'Service Alerts', icon: ShieldAlert },
    { id: 'passenger-profile', label: 'My Profile', icon: User },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: Activity },
    { id: 'admin-trains', label: 'Train Fleet', icon: TrainIcon },
    { id: 'admin-stations', label: 'Stations', icon: MapPin },
    { id: 'admin-tracks', label: 'Tracks & Routes', icon: GitFork },
    { id: 'admin-passengers', label: 'Passengers', icon: Users },
    { id: 'admin-tickets', label: 'All Tickets', icon: TicketIcon },
    { id: 'admin-capacity', label: 'Capacity Monitor', icon: Layers },
    { id: 'admin-schedules', label: 'Schedules', icon: Clock },
    { id: 'admin-fares', label: 'Fare Matrix', icon: Calculator },
    { id: 'admin-alerts', label: 'Alerts & Maintenance', icon: ShieldAlert },
    { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const activeNavItems = role === 'admin' ? adminNavItems : passengerNavItems;

  const handleLogout = () => {
    if (role === 'admin') {
      setRole('passenger');
      setCurrentTab('passenger-dashboard');
      showNotification('Exited Admin Section. Switched to Passenger Portal.', 'success');
    } else {
      setCurrentTab('passenger-dashboard');
      showNotification('Session reset to default passenger view.', 'success');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Bar with Role Switcher & System Controls */}
      <div className="bg-slate-900 text-white text-xs px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Section Role Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-medium hidden sm:inline">Active Section:</span>
          <div className="inline-flex rounded-xl bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => {
                setRole('passenger');
                setCurrentTab('passenger-dashboard');
              }}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
                role === 'passenger'
                  ? 'bg-[#0047BA] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Passenger Section (Default)</span>
            </button>

            <button
              onClick={() => {
                setRole('admin');
                setCurrentTab('admin-dashboard');
              }}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
                role === 'admin'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Section</span>
            </button>
          </div>
        </div>

        {/* Right: Notification Pill & System Persistence Controls */}
        <div className="flex items-center space-x-3">
          {notification && (
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
              notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              <span>{notification.text}</span>
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-1 text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
            title="Save files to disk via C++ FileManager"
          >
            <Save className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline">Save Files</span>
          </button>

          <button
            onClick={handleLoad}
            disabled={saving}
            className="flex items-center space-x-1 text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
            title="Reload disk data into C++ Engine"
          >
            <RefreshCw className={`w-3 h-3 text-emerald-400 ${saving ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Reload Files</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-[11px] font-semibold text-rose-300 hover:text-rose-100 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/60 transition"
            title="Logout and switch section"
          >
            <LogOut className="w-3 h-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Authority Label */}
          <div
            className="flex items-center space-x-3 cursor-pointer shrink-0"
            onClick={() => setCurrentTab(role === 'admin' ? 'admin-dashboard' : 'passenger-dashboard')}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition ${
              role === 'admin' ? 'bg-purple-700' : 'bg-[#0047BA]'
            }`}>
              <TrainIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Metro<span className={role === 'admin' ? 'text-purple-600' : 'text-[#0047BA]'}>X</span>
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  role === 'admin'
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : 'bg-blue-50 text-[#0047BA] border-blue-200'
                }`}>
                  {role === 'admin' ? 'Admin Authority' : 'Passenger Portal'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Smart Metro Transit Management System</p>
            </div>
          </div>

          {/* Desktop Navigation Scrollable / Wrap List */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1 max-w-3xl">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? role === 'admin'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-[#0047BA] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sub-Header Horizontal Bar for Medium & Mobile Viewports */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 space-x-1 text-xs">
        {activeNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 transition ${
                isActive
                  ? role === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#0047BA] text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
