import React from 'react';
import { SystemStats, Station, Train, Ticket } from '../types/metro';
import { 
  Train as TrainIcon, 
  MapPin, 
  CreditCard, 
  ShieldAlert, 
  Plus, 
  RefreshCw, 
  BarChart3,
  GitFork
} from 'lucide-react';

interface AdminDashboardPageProps {
  stats: SystemStats | null;
  stations: Station[];
  trains: Train[];
  tickets: Ticket[];
  onNavigate: (tab: string) => void;
  onRefresh: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  stats: _stats,
  stations,
  trains,
  tickets,
  onNavigate,
  onRefresh
}) => {
  const inService = trains.filter(t => t.status === 'IN_SERVICE');
  const confirmedTickets = tickets.filter(t => t.bookingStatus === 'CONFIRMED');
  const revenue = confirmedTickets.reduce((acc, t) => acc + t.finalFare, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400">ADMIN CONTROL CONSOLE</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Transit Authority Command Dashboard</h2>
          <p className="text-xs text-slate-400">
            Real-time fleet supervision, network topology configuration, statutory fare management, and passenger audit.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center space-x-1.5"
            title="Refresh All Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Engine</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Fleet in Service</span>
            <TrainIcon className="w-4 h-4 text-[#0047BA]" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{inService.length} / {trains.length}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {trains.reduce((acc, t) => acc + t.capacity, 0)} total seat inventory
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Station Network</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stations.length} Stations</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            Orange & Aqua lines operational
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Gross Revenue</span>
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹{revenue.toFixed(2)}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {confirmedTickets.length} confirmed bookings
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Active Alerts</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">3 Advisories</div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            Routine maintenance & pacing
          </p>
        </div>

      </div>

      {/* Admin Quick Action Shortcuts */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
          Authority Quick Management Operations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => onNavigate('admin-trains')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 text-left transition space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 group-hover:text-[#0047BA]">Train Management</span>
              <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0047BA]" />
            </div>
            <p className="text-[11px] text-slate-500">Register new trains, adjust capacity, change maintenance status.</p>
          </button>

          <button
            onClick={() => onNavigate('admin-stations')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 text-left transition space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 group-hover:text-[#0047BA]">Station Management</span>
              <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0047BA]" />
            </div>
            <p className="text-[11px] text-slate-500">Add stations, edit names/lines, and retire unused stops.</p>
          </button>

          <button
            onClick={() => onNavigate('admin-tracks')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 text-left transition space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 group-hover:text-[#0047BA]">Track & Route Management</span>
              <GitFork className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0047BA]" />
            </div>
            <p className="text-[11px] text-slate-500">Connect station tracks, adjust track distances, delete tracks.</p>
          </button>

          <button
            onClick={() => onNavigate('admin-fares')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 text-left transition space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 group-hover:text-[#0047BA]">Fare Management</span>
              <CreditCard className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0047BA]" />
            </div>
            <p className="text-[11px] text-slate-500">Adjust base tariff, km rates, and concession discount rules.</p>
          </button>

          <button
            onClick={() => onNavigate('admin-alerts')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 text-left transition space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 group-hover:text-[#0047BA]">Service Alerts & Delays</span>
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0047BA]" />
            </div>
            <p className="text-[11px] text-slate-500">Broadcast maintenance advisories or delay notices to passengers.</p>
          </button>

          <button
            onClick={() => onNavigate('admin-analytics')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 text-left transition space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 group-hover:text-[#0047BA]">Revenue & Booking Analytics</span>
              <BarChart3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0047BA]" />
            </div>
            <p className="text-[11px] text-slate-500">Review financial performance, popular pairs, and refund ratios.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
