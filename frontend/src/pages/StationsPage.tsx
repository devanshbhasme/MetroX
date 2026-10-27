import React, { useState } from 'react';
import { MapPin, Plus, CheckCircle2, AlertCircle, Edit3, Trash2 } from 'lucide-react';
import { Station } from '../types/metro';
import { api } from '../services/api';

interface StationsPageProps {
  stations: Station[];
  onRefresh: () => void;
  isAdmin?: boolean;
}

export const StationsPage: React.FC<StationsPageProps> = ({ stations, onRefresh, isAdmin = true }) => {
  // Add Station State
  const [stationName, setStationName] = useState('');
  const [stationLocation, setStationLocation] = useState('');
  const [addingStation, setAddingStation] = useState(false);
  const [stationError, setStationError] = useState<string | null>(null);
  const [stationSuccess, setStationSuccess] = useState<string | null>(null);

  // Edit Station State
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationName.trim()) return;

    setAddingStation(true);
    setStationError(null);
    setStationSuccess(null);

    try {
      const res = await api.addStation(stationName.trim(), stationLocation.trim() || 'Orange Line');
      setStationSuccess(`Station '${res.name}' created successfully with ID #${res.id}!`);
      setStationName('');
      setStationLocation('');
      onRefresh();
    } catch (err: any) {
      setStationError(err.message || 'Failed to add station.');
    } finally {
      setAddingStation(false);
    }
  };

  const handleOpenEdit = (st: Station) => {
    setEditingStation(st);
    setEditName(st.name);
    setEditLocation(st.location);
  };

  const handleUpdateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStation) return;
    try {
      await api.updateStation(editingStation.id, editName, editLocation);
      setStationSuccess(`Station #${editingStation.id} updated.`);
      setEditingStation(null);
      onRefresh();
    } catch (err: any) {
      setStationError(err.message || 'Failed to update station.');
    }
  };

  const handleDeleteStation = async (id: number) => {
    if (!window.confirm(`Are you sure you want to remove Station #${id} and delete all connecting tracks?`)) return;
    try {
      await api.deleteStation(id);
      setStationSuccess(`Station #${id} removed successfully.`);
      onRefresh();
    } catch (err: any) {
      setStationError(err.message || 'Failed to delete station.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#0047BA] uppercase tracking-wider mb-1">
          <MapPin className="w-4 h-4" />
          <span>Infrastructure & Station Matrix</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Station Management</h1>
        <p className="text-sm text-[#64748B]">
          Administer station nodes, corridor lines, modify station metadata, or decommission transit stops.
        </p>
      </div>

      {stationSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{stationSuccess}</span>
          </div>
          <button onClick={() => setStationSuccess(null)} className="text-xs font-bold text-emerald-700">Dismiss</button>
        </div>
      )}

      {stationError && (
        <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{stationError}</span>
          </div>
          <button onClick={() => setStationError(null)} className="text-xs font-bold text-red-700">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Station Form */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0047BA] flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Register New Station</h3>
              <p className="text-xs text-[#64748B]">Adds station node to graph</p>
            </div>
          </div>

          <form onSubmit={handleAddStation} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#334155] mb-1">Station Name</label>
              <input
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder="e.g., Subhash Nagar"
                required
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0047BA]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#334155] mb-1">Corridor Line / Location</label>
              <input
                type="text"
                value={stationLocation}
                onChange={(e) => setStationLocation(e.target.value)}
                placeholder="e.g., Orange Line, Aqua Line, or Interchange"
                required
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0047BA]"
              />
            </div>

            <button
              type="submit"
              disabled={addingStation || !stationName.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0047BA] hover:bg-[#003994] disabled:bg-slate-300 text-white font-semibold shadow-sm transition"
            >
              {addingStation ? 'Creating Station...' : 'Create Station Node'}
            </button>
          </form>
        </div>

        {/* Station Matrix & Management Table */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-sm text-[#0F172A]">Registered Stations ({stations.length} Nodes)</h3>
            <span className="text-xs font-mono text-slate-400">Orange & Aqua Lines</span>
          </div>
          
          <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-[#F8FAFC] z-10">
                <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Station Name</th>
                  <th className="py-2.5 px-3">Line</th>
                  <th className="py-2.5 px-3">Direct Links</th>
                  {isAdmin && <th className="py-2.5 px-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {stations.map((st) => (
                  <tr key={st.id} className="hover:bg-[#F8FAFC] transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0047BA]">#{st.id}</td>
                    <td className="py-2.5 px-3 font-bold text-[#0F172A]">{st.name}</td>
                    <td className="py-2.5 px-3 text-[#64748B]">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.name === 'Sitabuldi' ? 'bg-purple-100 text-purple-800' :
                        st.location.includes('Orange') ? 'bg-orange-100 text-orange-800' : 'bg-cyan-100 text-cyan-800'
                      }`}>
                        {st.location}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {st.connections.length === 0 ? (
                          <span className="text-[#94A3B8] italic">No tracks</span>
                        ) : (
                          st.connections.map((c, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-[#334155]"
                            >
                              → {c.targetName} ({c.distance}km)
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenEdit(st)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-600 transition"
                            title="Edit Station"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStation(st.id)}
                            className="p-1 rounded hover:bg-rose-100 text-rose-600 transition"
                            title="Remove Station"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Edit Station Modal */}
      {editingStation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900">Edit Station #{editingStation.id}</h3>
            <form onSubmit={handleUpdateStation} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Station Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corridor Line / Location</label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStation(null)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#0047BA] text-white font-bold rounded-lg hover:bg-blue-600 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
