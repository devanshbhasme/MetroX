import React, { useState, useEffect } from 'react';
import { Train, FleetAvailability } from '../types/metro';
import { api } from '../services/api';
import { Train as TrainIcon, RefreshCw, BarChart2 } from 'lucide-react';

interface TrainCapacityPageProps {
  trains: Train[];
  onRefresh: () => void;
}

export const TrainCapacityPage: React.FC<TrainCapacityPageProps> = ({ trains, onRefresh }) => {
  const [availability, setAvailability] = useState<FleetAvailability | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const data = await api.getTrainAvailability();
      setAvailability(data);
    } catch (e) {
      console.warn('Availability API fallback to props');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [trains]);

  const displayTrains = availability?.trains || trains;
  const inServiceTrains = displayTrains.filter(t => t.status === 'IN_SERVICE');
  const standbyTrains = displayTrains.filter(t => t.status === 'STANDBY');
  const maintenanceTrains = displayTrains.filter(t => t.status === 'MAINTENANCE');

  const totalCap = displayTrains.reduce((acc, t) => acc + t.capacity, 0);
  const currentPass = displayTrains.reduce((acc, t) => acc + t.currentPassengers, 0);
  const totalAvail = totalCap - currentPass;
  const occupancyPct = totalCap > 0 ? Math.round((currentPass / totalCap) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047BA] flex items-center justify-center border border-blue-200">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Train Capacity & Fleet Availability</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live seat inventory, passenger boarding load telemetry, and fleet operational availability.
            </p>
          </div>
        </div>

        <button
          onClick={() => { onRefresh(); fetchAvailability(); }}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition self-start sm:self-auto flex items-center space-x-1.5 text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Fleet State</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Fleet Capacity</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCap} Seats</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Across {displayTrains.length} registered train rakes</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Available Vacant Seats</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalAvail} Available</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Ready for instant ticket issuance</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Onboard Passenger Load</span>
          <div className="text-2xl font-black text-[#0047BA] mt-1">{currentPass} Boarded</div>
          <p className="text-[11px] text-slate-500 mt-0.5">{occupancyPct}% Aggregate Occupancy</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Rakes In Service</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{inServiceTrains.length} / {displayTrains.length}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">{standbyTrains.length} Standby • {maintenanceTrains.length} Maintenance</p>
        </div>
      </div>

      {/* Fleet Capacity Visual Bars */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center space-x-2">
          <TrainIcon className="w-4 h-4 text-[#0047BA]" />
          <span>Real-Time Train Capacity & Occupancy Status</span>
        </h3>

        <div className="space-y-4">
          {displayTrains.map((tr) => {
            const avail = Math.max(tr.capacity - tr.currentPassengers, 0);
            const occRate = tr.capacity > 0 ? Math.round((tr.currentPassengers / tr.capacity) * 100) : 0;
            const isFull = avail === 0;

            let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            if (tr.status === 'STANDBY') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
            if (tr.status === 'MAINTENANCE') badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';

            let barColor = 'bg-emerald-500';
            if (occRate > 60) barColor = 'bg-amber-500';
            if (occRate > 85) barColor = 'bg-rose-500';

            return (
              <div
                key={tr.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#0047BA] font-bold flex items-center justify-center text-xs">
                      #{tr.id}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{tr.name}</h4>
                      <span className="text-[11px] text-slate-500">
                        {tr.currentPassengers} / {tr.capacity} Passengers ({avail} seats open)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                      {tr.status}
                    </span>
                    {isFull && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                        FULL
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>Load: {occRate}%</span>
                    <span>Available Capacity: {avail}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(occRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
