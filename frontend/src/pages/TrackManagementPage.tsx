import React, { useState } from 'react';
import { Station } from '../types/metro';
import { api } from '../services/api';
import { GitFork, Plus, Edit3, Trash2, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

interface TrackManagementPageProps {
  stations: Station[];
  onRefresh: () => void;
}

export const TrackManagementPage: React.FC<TrackManagementPageProps> = ({ stations, onRefresh }) => {
  const [sourceId, setSourceId] = useState<number>(stations[0]?.id || 1);
  const [destId, setDestId] = useState<number>(stations[1]?.id || 2);
  const [distance, setDistance] = useState<number>(4.5);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Edit distance modal
  const [editingTrack, setEditingTrack] = useState<{ sId: number; sName: string; dId: number; dName: string; dist: number } | null>(null);
  const [newDistance, setNewDistance] = useState<number>(5.0);

  // Extract unique bidirectional tracks
  const trackSet = new Set<string>();
  const trackList: Array<{ sId: number; sName: string; dId: number; dName: string; dist: number }> = [];

  for (const st of stations) {
    for (const conn of st.connections || []) {
      const minId = Math.min(st.id, conn.targetId);
      const maxId = Math.max(st.id, conn.targetId);
      const key = `${minId}-${maxId}`;
      if (!trackSet.has(key)) {
        trackSet.add(key);
        trackList.push({
          sId: minId,
          sName: minId === st.id ? st.name : conn.targetName,
          dId: maxId,
          dName: maxId === conn.targetId ? conn.targetName : st.name,
          dist: conn.distance
        });
      }
    }
  }

  const showNotify = (text: string, type: 'success' | 'error') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceId === destId) {
      showNotify('Origin and destination stations must be distinct.', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.connectStations(sourceId, destId, distance);
      showNotify(`Track established between #${sourceId} and #${destId} (${distance} km).`, 'success');
      onRefresh();
    } catch (err: any) {
      showNotify(err.message || 'Failed to connect stations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDistance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;
    try {
      await api.updateTrackDistance(editingTrack.sId, editingTrack.dId, newDistance);
      showNotify(`Track distance updated to ${newDistance} km.`, 'success');
      setEditingTrack(null);
      onRefresh();
    } catch (err: any) {
      showNotify(err.message || 'Failed to update distance', 'error');
    }
  };

  const handleDeleteTrack = async (sId: number, dId: number) => {
    if (!window.confirm(`Remove track edge between Station #${sId} and #${dId}?`)) return;
    try {
      await api.deleteTrack(sId, dId);
      showNotify(`Track between #${sId} and #${dId} removed.`, 'success');
      onRefresh();
    } catch (err: any) {
      showNotify(err.message || 'Failed to remove track', 'error');
    }
  };

  const totalTrackKm = trackList.reduce((acc, t) => acc + t.dist, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Track & Route Management</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure bidirectional railway tracks, modify physical corridor distances, and manage network topology.
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition self-start sm:self-auto flex items-center space-x-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Tracks</span>
        </button>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 border ${
          notification.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Network Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Interconnected Tracks</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{trackList.length} Tracks</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Bidirectional physical connections</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Network Track Length</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{totalTrackKm.toFixed(1)} km</div>
          <p className="text-[11px] text-purple-900 font-medium mt-0.5">Dual-gauge electrified rail</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Central Interchange Hub</span>
          <div className="text-2xl font-black text-[#0047BA] mt-1">Sitabuldi</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Bi-level Orange/Aqua crossing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Add New Track Connection */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center space-x-1.5">
            <Plus className="w-4 h-4 text-[#0047BA]" />
            <span>Establish New Track Connection</span>
          </h3>

          <form onSubmit={handleConnect} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">First Station</label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-medium"
              >
                {stations.map(s => <option key={s.id} value={s.id}>#{s.id} {s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Second Station</label>
              <select
                value={destId}
                onChange={(e) => setDestId(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-medium"
              >
                {stations.map(s => <option key={s.id} value={s.id}>#{s.id} {s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Track Distance (km)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
                placeholder="e.g. 4.2"
              />
            </div>

            <button
              type="submit"
              disabled={loading || sourceId === destId}
              className="w-full py-2.5 bg-[#0047BA] hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition"
            >
              {loading ? 'Connecting...' : 'Establish Bidirectional Track'}
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Registered Track Links Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Active Rail Corridors & Track Edges</h3>
            <span className="text-xs font-mono text-slate-400">{trackList.length} Connected Edges</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {trackList.map((tr, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs hover:border-slate-300 transition"
              >
                <div className="flex items-center space-x-2 font-medium">
                  <span className="font-bold text-slate-900">#{tr.sId} {tr.sName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-900">#{tr.dId} {tr.dName}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {tr.dist} km
                  </span>
                  <button
                    onClick={() => {
                      setEditingTrack(tr);
                      setNewDistance(tr.dist);
                    }}
                    className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
                    title="Edit Distance"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTrack(tr.sId, tr.dId)}
                    className="p-1 rounded hover:bg-rose-100 text-rose-600 transition"
                    title="Remove Track"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Edit Distance Modal */}
      {editingTrack && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900">Update Track Distance</h3>
            <p className="text-slate-500">
              Between <strong>{editingTrack.sName}</strong> and <strong>{editingTrack.dName}</strong>
            </p>
            <form onSubmit={handleUpdateDistance} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Track Distance in Km</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={newDistance}
                  onChange={(e) => setNewDistance(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTrack(null)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#0047BA] text-white font-bold rounded-lg hover:bg-blue-600 transition"
                >
                  Save Distance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
