import React from 'react';
import { 
  MapPin, 
  Train as TrainIcon, 
  Ticket as TicketIcon, 
  IndianRupee, 
  ArrowUpRight, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { Station, Train, SystemStats } from '../types/metro';

interface DashboardPageProps {
  stats: SystemStats | null;
  stations: Station[];
  trains: Train[];
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ stats, stations, trains, onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero / Overview Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/60 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#0047BA] uppercase tracking-wider mb-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Transit Command Center</span>
            <span>•</span>
            <span className="text-[#64748B] font-mono">C++17 OOP Core Linked</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Metropolitan Smart Transit Control
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#64748B] leading-relaxed">
            Real-time telemetry, shortest-path rail routing via Dijkstra & BFS graph algorithms, polymorphic passenger concession rules, and instant train capacity enforcement.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('booking')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0047BA] hover:bg-[#003994] text-white text-sm font-semibold shadow-sm transition active:scale-98"
            >
              <TicketIcon className="w-4 h-4" />
              <span>Book Transit Pass</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('stations')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-sm font-semibold transition"
            >
              <MapPin className="w-4 h-4 text-[#0047BA]" />
              <span>Inspect Network Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:border-blue-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Active Stations</span>
            <div className="p-2 rounded-lg bg-blue-50 text-[#0047BA]">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-[#0F172A]">
              {stats?.stationCount ?? stations.length}
            </span>
            <span className="text-xs text-[#64748B] block mt-1">Interconnected transit nodes</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:border-blue-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Fleet Occupancy</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrainIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-[#0F172A]">
              {stats ? `${stats.averageOccupancyPercent.toFixed(1)}%` : '0%'}
            </span>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(stats?.averageOccupancyPercent || 0, 100)}%` }}
              />
            </div>
            <span className="text-xs text-[#64748B] block mt-1">
              {stats ? `${stats.currentPassengers} / ${stats.fleetCapacity} seats booked` : 'Capacity monitor'}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:border-blue-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Active Tickets</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <TicketIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-[#0F172A]">
              {stats?.activeTickets ?? 0}
            </span>
            <span className="text-xs text-[#64748B] block mt-1">
              Total issued: {stats?.ticketCount ?? 0}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:border-blue-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Total Transit Fare</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-[#0F172A]">
              ₹{stats ? stats.totalRevenue.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-[#64748B] block mt-1">Simulated revenue booked</span>
          </div>
        </div>

      </div>

      {/* Main Split: Network Topology & Fleet Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Network Stations & Connections */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">Network Topology Schema</h2>
              <p className="text-xs text-[#64748B]">Active stations and bidirectional track connections</p>
            </div>
            <button
              onClick={() => onNavigate('stations')}
              className="text-xs font-semibold text-[#0047BA] hover:underline flex items-center space-x-1"
            >
              <span>Manage Tracks</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stations.map((st) => (
              <div 
                key={st.id}
                className="border border-[#E2E8F0] rounded-xl p-4 bg-[#F8FAFC] hover:bg-white hover:border-blue-300 transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-md bg-[#0047BA]/10 text-[#0047BA] flex items-center justify-center text-xs font-mono font-bold">
                      {st.id}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-[#0F172A]">{st.name}</h4>
                      <span className="text-xs text-[#64748B] flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{st.location}</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#0047BA] border border-blue-200">
                    {st.connections.length} Links
                  </span>
                </div>

                {/* Connections Pills */}
                <div className="mt-3 pt-3 border-t border-[#E2E8F0]/70 flex flex-wrap gap-1.5">
                  {st.connections.length === 0 ? (
                    <span className="text-[11px] text-[#94A3B8] italic">No tracks linked yet</span>
                  ) : (
                    st.connections.map((c, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#334155]"
                      >
                        → {c.targetName} ({c.distance} km)
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Fleet Capacity Gauges */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">Fleet Capacity</h2>
              <p className="text-xs text-[#64748B]">Real-time boarding invariants</p>
            </div>
            <button
              onClick={() => onNavigate('trains')}
              className="text-xs font-semibold text-[#0047BA] hover:underline flex items-center space-x-1"
            >
              <span>View Fleet</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {trains.map((train) => {
              const isService = train.status === 'IN_SERVICE';
              const occPercent = train.capacity > 0 ? (train.currentPassengers / train.capacity) * 100 : 0;
              return (
                <div key={train.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <TrainIcon className="w-4 h-4 text-[#0047BA]" />
                      <span className="font-semibold text-xs text-[#0F172A]">{train.name}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isService ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {train.status}
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        occPercent >= 90 ? 'bg-red-500' : occPercent >= 70 ? 'bg-amber-500' : 'bg-[#0047BA]'
                      }`}
                      style={{ width: `${Math.min(occPercent, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-1.5 font-mono">
                    <span>{train.currentPassengers} / {train.capacity} seats</span>
                    <span className="font-bold text-[#334155]">{occPercent.toFixed(0)}% load</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* C++ Invariant Guarantee Card */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#0047BA]" />
              <span>C++ Capacity Guardrail</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Ticket booking automatically locks seats in memory via <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">train.boardPassengers()</code> and releases seats upon cancellation.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
