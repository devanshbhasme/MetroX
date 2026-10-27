import React, { useState, useRef, useEffect } from 'react';
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
  LogIn,
  RotateCcw,
  User,
  Shield,
  Layers,
  ChevronDown,
  Menu,
  X,
  Server,
  Target
} from 'lucide-react';
import { api } from '../services/api';
import { AuthUser } from '../types/metro';

export type RoleType = 'passenger' | 'admin';

interface NavbarProps {
  role: RoleType;
  setRole: (role: RoleType) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onRefresh: () => void;
  currentUser?: AuthUser | null;
  onSignInClick?: () => void;
  onSignOut?: () => void;
  onAdminClick?: () => void;
}

interface NavSubItem {
  id: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavSubItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  setRole,
  currentTab,
  setCurrentTab,
  onRefresh,
  currentUser,
  onSignInClick,
  onSignOut,
  onAdminClick
}) => {
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const showNotification = (text: string, type: 'success' | 'error') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setIsSystemMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsSystemMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      setIsSystemMenuOpen(false);
    }
  };

  const handleLoad = async () => {
    setSaving(true);
    try {
      const res = await api.loadSystemData();
      showNotification(res.message || 'System data reloaded into C++ engine', 'success');
      onRefresh();
    } catch (err: any) {
      showNotification(err.message || 'Failed to reload data', 'error');
    } finally {
      setSaving(false);
      setIsSystemMenuOpen(false);
    }
  };

  const handleLogout = () => {
    if (onSignOut) {
      onSignOut();
      showNotification('Signed out safely. Welcome to MetroX Mission overview.', 'success');
    } else {
      if (role === 'admin') {
        setRole('passenger');
      }
      showNotification('Switched to MetroX Mission overview.', 'success');
    }
    setCurrentTab('logged-out');
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  // Passenger Navigation Groups (Decluttered into 3 logical clusters + Direct Dashboard & Alerts)
  const passengerGroups: NavGroup[] = [
    {
      id: 'travel',
      label: 'Tickets & Travel',
      items: [
        { id: 'passenger-booking', label: 'Book Metro Ticket', desc: 'Single & return journey tokens with QR pass', icon: TicketIcon },
        { id: 'passenger-tickets', label: 'My Tickets & Passes', desc: 'Active travel passes & historic itineraries', icon: TicketIcon },
        { id: 'passenger-cancel', label: 'Cancel Ticket & Refund', desc: 'Automated 80% fare refund calculation', icon: RotateCcw },
      ]
    },
    {
      id: 'network',
      label: 'Lines & Schedules',
      items: [
        { id: 'passenger-map', label: 'Interactive Metro Map', desc: 'Orange & Aqua corridors with Sitabuldi Hub', icon: Compass },
        { id: 'passenger-routes', label: 'Routes & Interchanges', desc: 'Dijkstra shortest path vs BFS hop solver', icon: GitFork },
        { id: 'passenger-schedules', label: 'Train Timings & Headway', desc: 'First/last train timetables and frequencies', icon: Clock },
      ]
    },
    {
      id: 'services',
      label: 'Fares & Services',
      items: [
        { id: 'passenger-fares', label: 'Check Fare Rates', desc: 'Distance calculator & student/senior concessions', icon: Calculator },
        { id: 'passenger-facilities', label: 'Station Facilities', desc: 'Lifts, wheelchair ramps, TVMs & bus feeder bays', icon: Building2 },
        { id: 'passenger-alerts', label: 'Service Alerts & Delays', desc: 'Live corridor pacing and maintenance notices', icon: ShieldAlert },
        { id: 'logged-out', label: 'About & Our Purpose', desc: 'Civic mission, carbon offset & tech architecture', icon: Target },
      ]
    }
  ];

  // Admin Navigation Groups (Decluttered into 3 logical clusters + Direct Dashboard & Analytics)
  const adminGroups: NavGroup[] = [
    {
      id: 'fleet-infra',
      label: 'Fleet & Stations',
      items: [
        { id: 'admin-trains', label: 'Train Management', desc: 'Manage rakes, fleet status, and capacity limits', icon: TrainIcon },
        { id: 'admin-stations', label: 'Station Management', desc: 'Add/update stations and line assignments', icon: MapPin },
        { id: 'admin-tracks', label: 'Tracks & Routes', desc: 'Bilateral station track links and km distances', icon: GitFork },
        { id: 'admin-capacity', label: 'Train Capacity & Availability', desc: 'Live occupancy percentage & fleet readiness', icon: Layers },
      ]
    },
    {
      id: 'operations',
      label: 'Operations & Fares',
      items: [
        { id: 'admin-schedules', label: 'Timings & Schedules', desc: 'Edit corridor frequencies and operational hours', icon: Clock },
        { id: 'admin-fares', label: 'Fare Matrix Management', desc: 'Base fare, rate/km, and concession rules', icon: Calculator },
        { id: 'admin-alerts', label: 'Service Alerts & Broadcast', desc: 'Publish passenger advisories & track notices', icon: ShieldAlert },
      ]
    },
    {
      id: 'commuters',
      label: 'Passengers & Tickets',
      items: [
        { id: 'admin-passengers', label: 'Passenger Management', desc: 'Commuter registry, contact details & spend history', icon: Users },
        { id: 'admin-tickets', label: 'Ticket Management', desc: 'Global passenger ledger, seat allocation & statuses', icon: TicketIcon },
      ]
    }
  ];

  const currentGroups = role === 'admin' ? adminGroups : passengerGroups;
  const isDashboardActive = role === 'admin' ? currentTab === 'admin-dashboard' : currentTab === 'passenger-dashboard';
  const isAnalyticsActive = currentTab === 'admin-analytics';

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Identity & Active Section Badge */}
          <div className="flex items-center space-x-6">
            <div
              className="flex items-center space-x-3 cursor-pointer group shrink-0"
              onClick={() => setCurrentTab(role === 'admin' ? 'admin-dashboard' : 'passenger-dashboard')}
              title="Return to Dashboard"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 ${
                role === 'admin' 
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-700' 
                  : 'bg-gradient-to-br from-[#0047BA] to-blue-700'
              }`}>
                <TrainIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                    Metro<span className={role === 'admin' ? 'text-purple-600' : 'text-[#0047BA]'}>X</span>
                  </span>
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
                    role === 'admin'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-blue-50 text-[#0047BA] border-blue-200'
                  }`}>
                    {role === 'admin' ? 'Admin' : 'Transit'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium leading-tight hidden sm:inline">
                  {role === 'admin' ? 'Transit Authority Console' : 'Urban Commuter Network'}
                </span>
              </div>
            </div>

            {/* Desktop Decluttered Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* 1. Dashboard Direct Link */}
              <button
                onClick={() => {
                  setCurrentTab(role === 'admin' ? 'admin-dashboard' : 'passenger-dashboard');
                  setActiveDropdown(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  isDashboardActive
                    ? role === 'admin'
                      ? 'bg-purple-50 text-purple-700 font-bold'
                      : 'bg-blue-50 text-[#0047BA] font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${isDashboardActive ? (role === 'admin' ? 'text-purple-600' : 'text-[#0047BA]') : 'text-slate-400'}`} />
                <span>Dashboard</span>
              </button>

              {/* 2. Categorized Dropdown Groups */}
              {currentGroups.map((group) => {
                const isGroupActive = group.items.some(item => item.id === currentTab);
                const isOpen = activeDropdown === group.id;

                return (
                  <div key={group.id} className="relative">
                    <button
                      onClick={() => setActiveDropdown(isOpen ? null : group.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                        isGroupActive
                          ? role === 'admin'
                            ? 'bg-purple-50 text-purple-700 font-bold'
                            : 'bg-blue-50 text-[#0047BA] font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <span>{group.label}</span>
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-700' : ''}`} />
                    </button>

                    {/* Dropdown Floating Popover */}
                    {isOpen && (
                      <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{group.label}</span>
                        </div>
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isItemActive = currentTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setCurrentTab(item.id);
                                setActiveDropdown(null);
                              }}
                              className={`w-full px-3 py-2 text-left flex items-start space-x-3 transition ${
                                isItemActive
                                  ? role === 'admin' ? 'bg-purple-50/80 text-purple-900' : 'bg-blue-50/80 text-blue-900'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                                isItemActive
                                  ? role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-[#0047BA]'
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-xs font-semibold leading-tight ${isItemActive ? (role === 'admin' ? 'text-purple-700 font-bold' : 'text-[#0047BA] font-bold') : 'text-slate-900'}`}>
                                  {item.label}
                                </div>
                                <div className="text-[11px] text-slate-400 leading-tight truncate mt-0.5">
                                  {item.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 3. Analytics Direct Link (Admin Mode Only) */}
              {role === 'admin' && (
                <button
                  onClick={() => {
                    setCurrentTab('admin-analytics');
                    setActiveDropdown(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                    isAnalyticsActive
                      ? 'bg-purple-50 text-purple-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <BarChart3 className={`w-3.5 h-3.5 ${isAnalyticsActive ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span>Analytics</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right: Clean Segmented Role Switcher & Utility Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Segmented Section Switcher Pill */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/80 shadow-2xs">
              <button
                onClick={() => {
                  setRole('passenger');
                  setCurrentTab('passenger-dashboard');
                  setActiveDropdown(null);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  role === 'passenger'
                    ? 'bg-white text-[#0047BA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to Passenger Portal"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Passenger</span>
              </button>

              <button
                onClick={() => {
                  if (currentUser?.role === 'admin') {
                    setRole('admin');
                    setCurrentTab('admin-dashboard');
                  } else if (onAdminClick) {
                    onAdminClick();
                  } else {
                    setRole('admin');
                    setCurrentTab('admin-dashboard');
                  }
                  setActiveDropdown(null);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to Admin Authority Section"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>

            {/* Commuter Quick Profile Button or Sign In Button */}
            {role === 'passenger' && (
              currentUser ? (
                <button
                  onClick={() => {
                    setCurrentTab('passenger-profile');
                    setActiveDropdown(null);
                  }}
                  className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition ${
                    currentTab === 'passenger-profile'
                      ? 'bg-blue-50 border-blue-200 text-[#0047BA]'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                  title="View Smart Card & Preferences"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0047BA] flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ME'}
                  </div>
                  <div className="text-left text-xs leading-none">
                    <span className="font-semibold block text-slate-800 max-w-[100px] truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">₹{((currentUser.balance ?? currentUser.smartCardBalance) ?? 0).toFixed(2)}</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (onSignInClick) onSignInClick();
                    else setCurrentTab('customer-auth');
                    setActiveDropdown(null);
                  }}
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0047BA] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                  title="Sign In or Register"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )
            )}

            {/* Admin Badge in Admin Mode */}
            {role === 'admin' && currentUser?.role === 'admin' && (
              <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span className="truncate max-w-[110px]">{currentUser.name || 'Admin'}</span>
              </div>
            )}

            {/* System Persistence Menu (Clean Popover instead of cluttered buttons) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSystemMenuOpen(!isSystemMenuOpen);
                  setActiveDropdown(null);
                }}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                title="System Synchronization & Engine Status"
              >
                <Server className="w-4 h-4" />
              </button>

              {isSystemMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 p-3 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-800">C++ Engine Gateway</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Port 8080 Live
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Synchronize memory cache with flat-file data persistence (`data/*.txt`).
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold flex items-center justify-center space-x-1 transition"
                    >
                      <Save className="w-3.5 h-3.5 text-blue-600" />
                      <span>Save Files</span>
                    </button>

                    <button
                      onClick={handleLoad}
                      disabled={saving}
                      className="w-full py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold flex items-center justify-center space-x-1 transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${saving ? 'animate-spin' : ''}`} />
                      <span>Reload</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition"
              title="Logout / Reset Session"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              title="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating System Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-semibold border ${
            notification.type === 'success'
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-rose-900 text-white border-rose-700'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {/* Mobile Slide-Over Menu Sheet */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top duration-200 shadow-xl">
          {/* Dashboard Direct */}
          <button
            onClick={() => {
              setCurrentTab(role === 'admin' ? 'admin-dashboard' : 'passenger-dashboard');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full p-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 ${
              isDashboardActive ? (role === 'admin' ? 'bg-purple-600 text-white' : 'bg-[#0047BA] text-white') : 'bg-slate-50 text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{role === 'admin' ? 'Admin Dashboard' : 'Passenger Dashboard'}</span>
          </button>

          {/* Categorized Groups */}
          {currentGroups.map((group) => (
            <div key={group.id} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">{group.label}</span>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center space-x-3 text-xs transition ${
                        isItemActive
                          ? role === 'admin' ? 'bg-purple-50 text-purple-700 font-bold' : 'bg-blue-50 text-[#0047BA] font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Analytics (Admin) */}
          {role === 'admin' && (
            <button
              onClick={() => {
                setCurrentTab('admin-analytics');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 ${
                isAnalyticsActive ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Revenue & Analytics</span>
            </button>
          )}

          {/* Profile / Sign In (Passenger) */}
          {role === 'passenger' && (
            currentUser ? (
              <button
                onClick={() => {
                  setCurrentTab('passenger-profile');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full p-2.5 rounded-xl font-bold text-xs flex items-center justify-between bg-slate-50 text-slate-800"
              >
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#0047BA]" />
                  <span>{currentUser.name} ({currentUser.category})</span>
                </div>
                <span className="text-emerald-600 font-bold">₹{((currentUser.balance ?? currentUser.smartCardBalance) ?? 0).toFixed(2)}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (onSignInClick) onSignInClick();
                  else setCurrentTab('customer-auth');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full p-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 bg-[#0047BA] text-white shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )
          )}
        </div>
      )}
    </header>
  );
};
