import React, { useState, useEffect } from 'react';
import { Navbar, RoleType } from './components/Navbar';
import { PassengerDashboardPage } from './pages/PassengerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BookingPage } from './pages/BookingPage';
import { CancelTicketPage } from './pages/CancelTicketPage';
import { StationsPage } from './pages/StationsPage';
import { TrackManagementPage } from './pages/TrackManagementPage';
import { PassengersPage } from './pages/PassengersPage';
import { TrainsPage } from './pages/TrainsPage';
import { TrainCapacityPage } from './pages/TrainCapacityPage';
import { TicketsPage } from './pages/TicketsPage';
import { MetroMapPage } from './pages/MetroMapPage';
import { RoutesInterchangesPage } from './pages/RoutesInterchangesPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { FareCheckPage } from './pages/FareCheckPage';
import { StationFacilitiesPage } from './pages/StationFacilitiesPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnalyticsPage } from './pages/AnalyticsPage';

import { Station, Train, Passenger, Ticket, SystemStats } from './types/metro';
import { api } from './services/api';
import { AlertCircle, RefreshCw, Train as TrainIcon, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export const App: React.FC = () => {
  // Passenger section is default when program/website starts
  const [role, setRole] = useState<RoleType>('passenger');
  const [currentTab, setCurrentTab] = useState<string>('passenger-dashboard');

  const [stats, setStats] = useState<SystemStats | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      const [statsData, stData, trData, psData, tkData] = await Promise.all([
        api.getStats().catch(() => null),
        api.getStations(),
        api.getTrains(),
        api.getPassengers(),
        api.getTickets(),
      ]);

      setStats(statsData);
      setStations(stData);
      setTrains(trData);
      setPassengers(psData);
      setTickets(tkData);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch MetroX state:', err);
      setError(err.message || 'Cannot reach Express Gateway or C++ Core Engine');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#0F172A] font-sans">
      
      {/* Top Navbar with Section Switcher */}
      <Navbar
        role={role}
        setRole={setRole}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onRefresh={fetchAllData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Connection Failure Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">C++ Engine or Express Gateway Not Responding</h4>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchAllData}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold self-start sm:self-auto flex items-center space-x-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Global Loading State */}
        {loading && stations.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-[#0047BA] animate-spin mx-auto" />
            <p className="text-sm font-semibold text-[#64748B]">Connecting to MetroX Transit Core Engine...</p>
          </div>
        ) : (
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* ================= PASSENGER SECTION ================= */}
            {currentTab === 'passenger-dashboard' && (
              <PassengerDashboardPage
                stations={stations}
                trains={trains}
                tickets={tickets}
                onNavigate={setCurrentTab}
              />
            )}

            {currentTab === 'passenger-booking' && (
              <BookingPage
                stations={stations}
                trains={trains}
                passengers={passengers}
                onBookingSuccess={fetchAllData}
              />
            )}

            {currentTab === 'passenger-cancel' && (
              <CancelTicketPage
                tickets={tickets}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === 'passenger-tickets' && (
              <TicketsPage
                tickets={tickets}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === 'passenger-map' && (
              <MetroMapPage
                stations={stations}
                onSelectRoute={() => setCurrentTab('passenger-booking')}
              />
            )}

            {currentTab === 'passenger-routes' && (
              <RoutesInterchangesPage
                stations={stations}
              />
            )}

            {currentTab === 'passenger-schedules' && (
              <SchedulesPage
                isAdmin={false}
              />
            )}

            {currentTab === 'passenger-fares' && (
              <FareCheckPage
                stations={stations}
                isAdmin={false}
              />
            )}

            {currentTab === 'passenger-facilities' && (
              <StationFacilitiesPage
                stations={stations}
              />
            )}

            {currentTab === 'passenger-alerts' && (
              <AlertsPage
                isAdmin={false}
              />
            )}

            {currentTab === 'passenger-profile' && (
              <ProfilePage
                stations={stations}
                tickets={tickets}
              />
            )}

            {/* ================= ADMIN SECTION ================= */}
            {currentTab === 'admin-dashboard' && (
              <AdminDashboardPage
                stats={stats}
                stations={stations}
                trains={trains}
                tickets={tickets}
                onNavigate={setCurrentTab}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === 'admin-trains' && (
              <TrainsPage
                trains={trains}
                onRefresh={fetchAllData}
                isAdmin={true}
              />
            )}

            {currentTab === 'admin-stations' && (
              <StationsPage
                stations={stations}
                onRefresh={fetchAllData}
                isAdmin={true}
              />
            )}

            {currentTab === 'admin-tracks' && (
              <TrackManagementPage
                stations={stations}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === 'admin-passengers' && (
              <PassengersPage
                passengers={passengers}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === 'admin-tickets' && (
              <TicketsPage
                tickets={tickets}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === 'admin-capacity' && (
              <TrainCapacityPage
                trains={trains}
                onRefresh={fetchAllData}
              />
            )}

            {currentTab === 'admin-schedules' && (
              <SchedulesPage
                isAdmin={true}
              />
            )}

            {currentTab === 'admin-fares' && (
              <FareCheckPage
                stations={stations}
                isAdmin={true}
              />
            )}

            {currentTab === 'admin-alerts' && (
              <AlertsPage
                isAdmin={true}
              />
            )}

            {currentTab === 'admin-analytics' && (
              <AnalyticsPage />
            )}
          </motion.div>
        )}

      </main>

      {/* Transit Editorial Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-6 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${
              role === 'admin' ? 'bg-purple-700' : 'bg-[#0047BA]'
            }`}>
              <TrainIcon className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#0F172A]">MetroX Transit Authority</span>
            <span>•</span>
            <span>Active Mode: <strong className="capitalize">{role} Section</strong></span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded-md text-[#334155]">
              <Terminal className="w-3.5 h-3.5 text-[#0047BA]" />
              <span>Full-Stack Metro Transit Suite</span>
            </span>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              C++ Core Engine & Express Gateway Active
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};
