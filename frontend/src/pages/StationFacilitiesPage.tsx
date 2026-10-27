import React, { useState } from 'react';
import { Station } from '../types/metro';
import { Building2, Search, ShieldCheck, MapPin, Wifi, Car, Accessibility, Bus, PhoneCall } from 'lucide-react';

interface StationFacilitiesPageProps {
  stations: Station[];
}

export const StationFacilitiesPage: React.FC<StationFacilitiesPageProps> = ({ stations }) => {
  const [search, setSearch] = useState('');
  const [selectedStation, setSelectedStation] = useState<Station | null>(stations[0] || null);

  const filteredStations = stations.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  const standardAmenities = [
    { name: 'Accessible Elevators / Lifts', icon: Accessibility, desc: 'Dual elevators from concourse to all platforms' },
    { name: 'Wheelchair Ramps & Tactile Paths', icon: Accessibility, desc: 'End-to-end barrier-free passenger mobility' },
    { name: 'Dedicated Vehicle Parking', icon: Car, desc: 'Secure two-wheeler and four-wheeler multi-level bays' },
    { name: 'Free High-Speed Station Wi-Fi', icon: Wifi, desc: 'High-bandwidth transit connectivity on all levels' },
    { name: 'Feeder Bus & EV Charging', icon: Bus, desc: 'Direct interchange with municipal feeder electric buses' },
    { name: 'Station Control & First Aid', icon: ShieldCheck, desc: '24/7 emergency response and on-duty station manager' },
    { name: 'Automatic TVM Machines', icon: Building2, desc: 'Cash, UPI, and debit card token dispensing' },
    { name: 'Passenger Help Desk', icon: PhoneCall, desc: 'Station information desk near Concourse Gate 1' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047BA] flex items-center justify-center border border-blue-200">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Station Details & Passenger Facilities</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive accessibility, mobility infrastructure, and commuter services across all 37 Nagpur Metro stations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stations Directory */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Station Directory</h3>
            <span className="text-xs font-mono text-slate-400">{filteredStations.length} Stations</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search station or line..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredStations.map((st) => {
              const isSelected = selectedStation?.id === st.id;
              const isInterchange = st.name === 'Sitabuldi';
              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedStation(st)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'border-[#0047BA] bg-blue-50/50 shadow-xs'
                      : 'border-slate-100 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-xs text-slate-900">{st.name}</span>
                      {isInterchange && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800">
                          Interchange
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block">{st.location}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">#{st.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Station Amenities Detail Inspector */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {selectedStation ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black text-slate-900">{selectedStation.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0047BA] border border-blue-200">
                      Station #{selectedStation.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Corridor: {selectedStation.location}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Track Links</span>
                  <span className="text-sm font-bold font-mono text-slate-800">
                    {selectedStation.connections?.length || 0} Connected Stations
                  </span>
                </div>
              </div>

              {/* Amenities Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Verified Station Facilities & Services
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {standardAmenities.map((amenity, idx) => {
                    const Icon = amenity.icon;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start space-x-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{amenity.name}</span>
                          <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">{amenity.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security & Accessibility Highlights */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 space-y-1.5 text-xs text-blue-950">
                <div className="font-bold flex items-center space-x-1.5 text-[#0047BA]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Compliant Barrier-Free Station Standards</span>
                </div>
                <p className="text-blue-900 leading-relaxed text-[11px]">
                  Equipped with audio-visual station announcements, tactile paving for visually impaired passengers, dedicated priority boarding gates, and 24/7 CCTV surveillance monitoring.
                </p>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400">
              Select a station on the left to inspect facilities.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
