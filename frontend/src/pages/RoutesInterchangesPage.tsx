import React, { useState } from 'react';
import { Station, RouteFindingResponse } from '../types/metro';
import { api } from '../services/api';
import { GitFork, ArrowRight, Compass } from 'lucide-react';

interface RoutesInterchangesPageProps {
  stations: Station[];
}

export const RoutesInterchangesPage: React.FC<RoutesInterchangesPageProps> = ({ stations }) => {
  const [sourceId, setSourceId] = useState<number>(stations[0]?.id || 1);
  const [destId, setDestId] = useState<number>(stations[stations.length - 1]?.id || 2);
  const [algorithm, setAlgorithm] = useState<'dijkstra' | 'bfs'>('dijkstra');
  const [routeResult, setRouteResult] = useState<RouteFindingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const interchangeStation = stations.find(s => s.name === 'Sitabuldi');

  const handleFindRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceId === destId) return;
    setLoading(true);
    try {
      const res = await api.findRoute(sourceId, destId, algorithm);
      setRouteResult(res);
    } catch (err: any) {
      alert(err.message || 'Route not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Metro Routes & Interchanges</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore interconnected transit lines, transfer protocols at Sitabuldi Junction, and query path algorithms.
            </p>
          </div>
        </div>
      </div>

      {/* Sitabuldi Interchange Feature Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-400/20 text-purple-200 border border-purple-300/30">
                CENTRAL INTERCHANGE
              </span>
              <span className="text-xs text-purple-200">Station #{interchangeStation?.id || 8}</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white">Sitabuldi Interchange Station</h3>
            <p className="text-xs text-purple-100/80 max-w-2xl leading-relaxed">
              Bi-level hub connecting Orange Line (North-South: Automotive Square ➔ Khapri) on Platform 1 & 2 with Aqua Line (East-West: Prajapati Nagar ➔ Lokmanya Nagar) on Platform 3 & 4. Seamless transfer within 2 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 self-start md:self-auto text-xs font-semibold">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
              <span className="text-orange-400 block font-bold">Level 2</span>
              <span className="text-slate-300 text-[11px]">Orange Line</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
              <span className="text-cyan-400 block font-bold">Level 1</span>
              <span className="text-slate-300 text-[11px]">Aqua Line</span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Finder Query Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Route Query Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center space-x-2">
            <Compass className="w-4 h-4 text-[#0047BA]" />
            <span>Interactive Route Engine</span>
          </h3>

          <form onSubmit={handleFindRoute} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Origin Station</label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-medium"
              >
                {stations.map(s => <option key={s.id} value={s.id}>#{s.id} {s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destination Station</label>
              <select
                value={destId}
                onChange={(e) => setDestId(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-medium"
              >
                {stations.map(s => <option key={s.id} value={s.id}>#{s.id} {s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Optimization Algorithm</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAlgorithm('dijkstra')}
                  className={`p-2 rounded-lg border font-semibold transition ${
                    algorithm === 'dijkstra'
                      ? 'border-[#0047BA] bg-blue-50 text-[#0047BA]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Dijkstra (Shortest Km)
                </button>
                <button
                  type="button"
                  onClick={() => setAlgorithm('bfs')}
                  className={`p-2 rounded-lg border font-semibold transition ${
                    algorithm === 'bfs'
                      ? 'border-[#0047BA] bg-blue-50 text-[#0047BA]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  BFS (Minimum Hops)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || sourceId === destId}
              className="w-full py-2.5 bg-[#0047BA] hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition"
            >
              {loading ? 'Solving Graph...' : 'Compute Route Path'}
            </button>
          </form>
        </div>

        {/* Route Path Inspection Result */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Route Execution Report</h3>
              {routeResult && (
                <span className="text-xs font-mono font-bold text-[#0047BA] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {routeResult.algorithm}
                </span>
              )}
            </div>

            {routeResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Distance</span>
                    <span className="text-lg font-black text-slate-900">{routeResult.distance.toFixed(1)} km</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Intermediate Hops</span>
                    <span className="text-lg font-black text-slate-900">{routeResult.hops} stops</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Estimated Duration</span>
                    <span className="text-lg font-black text-emerald-700">~{Math.round(routeResult.distance * 2.2 + 4)} mins</span>
                  </div>
                </div>

                {/* Step by step path sequence */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Station Waypoints</h4>
                  <div className="flex flex-wrap items-center gap-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    {routeResult.pathStations?.map((st, i) => {
                      const isInterchange = st.name === 'Sitabuldi';
                      return (
                        <React.Fragment key={st.id}>
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                              isInterchange
                                ? 'bg-purple-600 text-white shadow-xs'
                                : i === 0
                                ? 'bg-emerald-600 text-white'
                                : i === (routeResult.pathStations?.length || 0) - 1
                                ? 'bg-rose-600 text-white'
                                : 'bg-white text-slate-800 border border-slate-200'
                            }`}
                          >
                            {st.name}
                          </span>
                          {i < (routeResult.pathStations?.length || 0) - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">
                Select an origin and destination station and click "Compute Route Path" to visualize the journey stops.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Graph Structure: Undirected Weighted Adjacency Matrix</span>
            <span className="font-semibold text-emerald-700">All Lines Synchronized</span>
          </div>
        </div>

      </div>
    </div>
  );
};
