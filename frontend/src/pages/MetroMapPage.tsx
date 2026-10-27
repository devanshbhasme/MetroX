import React, { useState } from 'react';
import { Station } from '../types/metro';
import { MapPin, Info, ArrowRight, Compass, Layers } from 'lucide-react';

interface MetroMapPageProps {
  stations: Station[];
  onSelectRoute?: (originId: number, destId: number) => void;
}

export const MetroMapPage: React.FC<MetroMapPageProps> = ({ stations, onSelectRoute }) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedLine, setSelectedLine] = useState<'all' | 'Orange Line' | 'Aqua Line'>('all');
  const [originId, setOriginId] = useState<number | null>(null);
  const [destId, setDestId] = useState<number | null>(null);

  const orangeStations = stations.filter(s => s.location.includes('Orange') || s.name === 'Sitabuldi');
  const aquaStations = stations.filter(s => s.location.includes('Aqua') || s.name === 'Sitabuldi');

  const handleStationClick = (st: Station) => {
    setSelectedStation(st);
    if (!originId) {
      setOriginId(st.id);
    } else if (!destId && st.id !== originId) {
      setDestId(st.id);
    }
  };

  const getLineBadge = (location: string, name: string) => {
    if (name === 'Sitabuldi' || location.includes('Interchange')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">Interchange</span>;
    }
    if (location.includes('Orange')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-300">Orange Line</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">Aqua Line</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-6 h-6 text-[#0047BA]" />
            <h2 className="text-xl font-bold text-slate-900">Interactive Metro Map</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual schematic network representing Nagpur Metro North-South (Orange) and East-West (Aqua) corridors with Sitabuldi Central Interchange.
          </p>
        </div>

        {/* Line Filter */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setSelectedLine('all')}
            className={`px-3 py-1.5 rounded-lg transition ${selectedLine === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All Lines ({stations.length})
          </button>
          <button
            onClick={() => setSelectedLine('Orange Line')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${selectedLine === 'Orange Line' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-orange-600'}`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span>Orange Line</span>
          </button>
          <button
            onClick={() => setSelectedLine('Aqua Line')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ${selectedLine === 'Aqua Line' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-cyan-600'}`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Aqua Line</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map View & Station Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Schematic Map */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Transit Network Graph</span>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500 border border-white/40"></span>
                <span className="text-slate-300">Orange: North-South</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400 border border-white/40"></span>
                <span className="text-slate-300">Aqua: East-West</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500 border border-white"></span>
                <span className="text-slate-300">Sitabuldi Interchange</span>
              </span>
            </div>
          </div>

          {/* Interactive Station Grid Representation */}
          <div className="py-8 overflow-x-auto">
            <div className="min-w-[600px] space-y-6">
              
              {/* Orange Line Horizontal Track */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-orange-400 mb-2">
                  <span>Orange Line Corridor (Automotive Square ➔ Khapri)</span>
                  <span className="font-mono text-[11px] text-slate-400">18 Stations</span>
                </div>
                <div className="relative flex items-center space-x-2 bg-slate-800/80 p-3 rounded-xl border border-orange-500/30 overflow-x-auto scrollbar-thin">
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500 -translate-y-1/2 z-0"></div>
                  {orangeStations.map((st) => {
                    const isSelected = selectedStation?.id === st.id;
                    const isInterchange = st.name === 'Sitabuldi';
                    const isOrigin = originId === st.id;
                    const isDest = destId === st.id;
                    return (
                      <button
                        key={`orange-${st.id}`}
                        onClick={() => handleStationClick(st)}
                        title={`Station #${st.id}: ${st.name}`}
                        className={`relative z-10 shrink-0 flex flex-col items-center group cursor-pointer p-1.5 rounded-lg transition-all ${
                          isSelected ? 'bg-orange-500/20 scale-110' : 'hover:scale-105'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border-2 transition shadow-sm ${
                            isInterchange
                              ? 'bg-purple-600 text-white border-white scale-125 ring-2 ring-purple-400 animate-pulse'
                              : isOrigin
                              ? 'bg-emerald-500 text-white border-white'
                              : isDest
                              ? 'bg-rose-500 text-white border-white'
                              : 'bg-slate-900 text-orange-400 border-orange-500 group-hover:bg-orange-500 group-hover:text-white'
                          }`}
                        >
                          {st.id}
                        </div>
                        <span className={`text-[10px] max-w-[70px] truncate text-center mt-1 font-medium ${
                          isInterchange ? 'text-purple-300 font-bold' : 'text-slate-300'
                        }`}>
                          {st.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Aqua Line Horizontal Track */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-2">
                  <span>Aqua Line Corridor (Prajapati Nagar ➔ Lokmanya Nagar)</span>
                  <span className="font-mono text-[11px] text-slate-400">19 Stations</span>
                </div>
                <div className="relative flex items-center space-x-2 bg-slate-800/80 p-3 rounded-xl border border-cyan-500/30 overflow-x-auto scrollbar-thin">
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 -translate-y-1/2 z-0"></div>
                  {aquaStations.map((st) => {
                    const isSelected = selectedStation?.id === st.id;
                    const isInterchange = st.name === 'Sitabuldi';
                    const isOrigin = originId === st.id;
                    const isDest = destId === st.id;
                    return (
                      <button
                        key={`aqua-${st.id}`}
                        onClick={() => handleStationClick(st)}
                        title={`Station #${st.id}: ${st.name}`}
                        className={`relative z-10 shrink-0 flex flex-col items-center group cursor-pointer p-1.5 rounded-lg transition-all ${
                          isSelected ? 'bg-cyan-500/20 scale-110' : 'hover:scale-105'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border-2 transition shadow-sm ${
                            isInterchange
                              ? 'bg-purple-600 text-white border-white scale-125 ring-2 ring-purple-400 animate-pulse'
                              : isOrigin
                              ? 'bg-emerald-500 text-white border-white'
                              : isDest
                              ? 'bg-rose-500 text-white border-white'
                              : 'bg-slate-900 text-cyan-400 border-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-900'
                          }`}
                        >
                          {st.id}
                        </div>
                        <span className={`text-[10px] max-w-[70px] truncate text-center mt-1 font-medium ${
                          isInterchange ? 'text-purple-300 font-bold' : 'text-slate-300'
                        }`}>
                          {st.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Quick Route Plan Helper */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Selected Path:</span>
              <span className="px-2 py-1 rounded bg-slate-800 font-mono text-emerald-400">
                {originId ? stations.find(s => s.id === originId)?.name : 'Origin (Select)'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="px-2 py-1 rounded bg-slate-800 font-mono text-rose-400">
                {destId ? stations.find(s => s.id === destId)?.name : 'Destination (Select)'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => { setOriginId(null); setDestId(null); }}
                className="px-2.5 py-1 text-slate-400 hover:text-white transition"
              >
                Reset
              </button>
              {originId && destId && onSelectRoute && (
                <button
                  onClick={() => onSelectRoute(originId, destId)}
                  className="px-3.5 py-1.5 bg-[#0047BA] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm flex items-center space-x-1 transition"
                >
                  <span>Book This Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Station Inspector Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#0047BA]" />
                <span>Station Inspector</span>
              </h3>
              {selectedStation && getLineBadge(selectedStation.location, selectedStation.name)}
            </div>

            {selectedStation ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-slate-900">{selectedStation.name}</span>
                    <span className="text-xs font-mono font-semibold text-slate-400">#{selectedStation.id}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedStation.location}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Direct Rail Connections</div>
                  <div className="space-y-1.5">
                    {selectedStation.connections && selectedStation.connections.length > 0 ? (
                      selectedStation.connections.map((c) => (
                        <div key={c.targetId} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white border border-slate-200/60 font-medium">
                          <span className="text-slate-800">{c.targetName}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{c.distance} km</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No track connections registered.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Accessible Lifts</span>
                    <span className="font-semibold text-emerald-600">Available</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Ticket Vending Machine</span>
                    <span className="font-semibold text-slate-800">Operational</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Feeder Bus Bay</span>
                    <span className="font-semibold text-slate-800">Yes (Exit 1)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Info className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">Click on any station marker in the map to inspect track connections and amenities.</p>
              </div>
            )}
          </div>

          {selectedStation && (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setOriginId(selectedStation.id)}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition"
              >
                Set as Origin
              </button>
              <button
                onClick={() => setDestId(selectedStation.id)}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition"
              >
                Set as Destination
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
