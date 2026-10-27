import React from 'react';
import { Station, Train, Ticket } from '../types/metro';
import { 
  Ticket as TicketIcon, 
  Clock, 
  Compass, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Train as TrainIcon,
  RotateCcw
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';

interface PassengerDashboardPageProps {
  stations: Station[];
  trains: Train[];
  tickets: Ticket[];
  onNavigate: (tab: string) => void;
}

export const PassengerDashboardPage: React.FC<PassengerDashboardPageProps> = ({
  stations,
  trains,
  tickets,
  onNavigate
}) => {
  const activeTickets = tickets.filter(t => t.bookingStatus === 'CONFIRMED');
  const inServiceTrains = trains.filter(t => t.status === 'IN_SERVICE');

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <ScrollReveal direction="down" duration={0.5}>
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0047BA] via-blue-700 to-indigo-900 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Nagpur Smart Metro Transit • Commuter Portal</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight leading-tight sm:text-4xl">
              Fast, Clean & Barrier-Free Urban Transit
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Welcome to the MetroX commuter authority portal. Book tokens, check fares across {stations.length} network stations, track real-time train timings, and inspect interactive line maps.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('passenger-booking')}
                className="px-5 py-2.5 rounded-xl bg-white text-[#0047BA] font-bold text-xs shadow-md hover:bg-blue-50 transition flex items-center space-x-1.5"
              >
                <TicketIcon className="w-4 h-4" />
                <span>Book Journey Token</span>
              </button>
              <button
                onClick={() => onNavigate('passenger-map')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition flex items-center space-x-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Metro Map</span>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Live System Operational Status Row */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4" staggerDelay={0.08}>
        <StaggerItem>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3 hover:border-blue-200 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Network Punctuality</span>
              <div className="text-sm font-black text-slate-900">99.4% On-Time</div>
              <span className="text-[11px] text-emerald-600 font-medium">Sitabuldi Interchange clear</span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3 hover:border-blue-200 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047BA] flex items-center justify-center border border-blue-200">
              <TrainIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Fleet In Service</span>
              <div className="text-sm font-black text-slate-900">{inServiceTrains.length} Metro Trains</div>
              <span className="text-[11px] text-slate-500 font-medium">Orange & Aqua Lines</span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3 hover:border-blue-200 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Peak Frequency</span>
              <div className="text-sm font-black text-slate-900">Every 6 - 7 Mins</div>
              <span className="text-[11px] text-slate-500 font-medium">Operating till 22:30 PM</span>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Active Passenger Tickets Banner (if any) */}
      {activeTickets.length > 0 && (
        <ScrollReveal direction="up" delay={0.1}>
          <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TicketIcon className="w-5 h-5 text-[#0047BA]" />
                <h3 className="text-sm font-bold text-slate-900">Your Active Journey Tokens</h3>
              </div>
              <button
                onClick={() => onNavigate('passenger-tickets')}
                className="text-xs font-bold text-[#0047BA] hover:underline flex items-center space-x-1"
              >
                <span>View All History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTickets.slice(0, 2).map((t) => (
                <div
                  key={t.ticketId}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0047BA]">Token #{t.ticketId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      CONFIRMED
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-black text-slate-900">
                      {t.sourceStationName} ➔ {t.destinationStationName}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Assigned Train: {t.trainName} • {t.distance} km
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="font-bold text-slate-900">Fare: ₹{t.finalFare.toFixed(2)}</span>
                    <button
                      onClick={() => onNavigate('passenger-cancel')}
                      className="text-rose-600 hover:text-rose-800 font-bold text-xs flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Cancel & Refund</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Quick Navigation Cards Grid */}
      <ScrollReveal direction="up" delay={0.15}>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Passenger Transit Services</h3>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.06}>
            <StaggerItem>
              <button
                onClick={() => onNavigate('passenger-booking')}
                className="w-full p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md shadow-xs text-left group transition flex flex-col justify-between space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0047BA] flex items-center justify-center">
                  <TicketIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#0047BA] transition">Book Metro Ticket</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Instant booking with UPI, Card, or Cash simulation.</p>
                </div>
                <span className="text-[11px] font-bold text-[#0047BA] flex items-center space-x-1">
                  <span>Book Token</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                onClick={() => onNavigate('passenger-map')}
                className="w-full p-5 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 hover:shadow-md shadow-xs text-left group transition flex flex-col justify-between space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition">Interactive Metro Map</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Schematic view of Orange Line, Aqua Line & Sitabuldi.</p>
                </div>
                <span className="text-[11px] font-bold text-orange-600 flex items-center space-x-1">
                  <span>Open Map</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                onClick={() => onNavigate('passenger-schedules')}
                className="w-full p-5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-md shadow-xs text-left group transition flex flex-col justify-between space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-cyan-700 transition">Timings & Schedules</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">First & last train schedules and peak hour frequencies.</p>
                </div>
                <span className="text-[11px] font-bold text-cyan-700 flex items-center space-x-1">
                  <span>View Timetable</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                onClick={() => onNavigate('passenger-fares')}
                className="w-full p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md shadow-xs text-left group transition flex flex-col justify-between space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-purple-700 transition">Check Journey Fare</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Point-to-point tariff and Student/Senior concessions.</p>
                </div>
                <span className="text-[11px] font-bold text-purple-700 flex items-center space-x-1">
                  <span>Check Fare</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </button>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </ScrollReveal>
    </div>
  );
};
