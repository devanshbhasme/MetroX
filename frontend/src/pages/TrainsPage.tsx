import React, { useState } from 'react';
import { Train as TrainIcon, Plus, CheckCircle2, AlertCircle, ShieldCheck, Edit3, Trash2 } from 'lucide-react';
import { Train } from '../types/metro';
import { api } from '../services/api';

interface TrainsPageProps {
  trains: Train[];
  onRefresh: () => void;
  isAdmin?: boolean;
}

export const TrainsPage: React.FC<TrainsPageProps> = ({ trains, onRefresh, isAdmin = true }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number>(150);
  const [status, setStatus] = useState<string>('IN_SERVICE');
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit train modal state
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);
  const [editName, setEditName] = useState('');
  const [editCapacity, setEditCapacity] = useState(150);
  const [editStatus, setEditStatus] = useState('IN_SERVICE');

  const handleAddTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setAdding(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await api.addTrain(name.trim(), Number(capacity), status);
      setSuccessMsg(`Train '${name}' added successfully to fleet with ID #${res.id}!`);
      setName('');
      setCapacity(150);
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add train.');
    } finally {
      setAdding(false);
    }
  };

  const handleOpenEdit = (t: Train) => {
    setEditingTrain(t);
    setEditName(t.name);
    setEditCapacity(t.capacity);
    setEditStatus(t.status);
  };

  const handleUpdateTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrain) return;
    try {
      await api.updateTrain(editingTrain.id, {
        name: editName,
        capacity: editCapacity,
        status: editStatus
      });
      setSuccessMsg(`Train #${editingTrain.id} updated successfully.`);
      setEditingTrain(null);
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update train.');
    }
  };

  const handleDeleteTrain = async (id: number) => {
    if (!window.confirm(`Are you sure you want to retire and remove Train #${id} from the fleet?`)) return;
    try {
      await api.deleteTrain(id);
      setSuccessMsg(`Train #${id} retired successfully.`);
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove train.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#0047BA] uppercase tracking-wider mb-1">
          <TrainIcon className="w-4 h-4" />
          <span>Rolling Stock Operations</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Train Fleet Management</h1>
        <p className="text-sm text-[#64748B]">
          Administer train fleet units, modify operational availability status, update seating capacity, and remove retired rakes.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs font-bold text-emerald-700">Dismiss</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-xs font-bold text-red-700">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Train Form */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0047BA] flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Add Train to Fleet</h3>
              <p className="text-xs text-[#64748B]">Registers a new train in the fleet</p>
            </div>
          </div>

          <form onSubmit={handleAddTrain} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#334155] mb-1">Train Model / Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Nagpur Metro Orange Line - 05"
                required
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0047BA]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#334155] mb-1">Total Passenger Capacity</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-mono font-bold focus:outline-none focus:border-[#0047BA]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#334155] mb-1">Operational Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium focus:outline-none focus:border-[#0047BA]"
              >
                <option value="IN_SERVICE">IN_SERVICE (Active for Boarding)</option>
                <option value="STANDBY">STANDBY (Reserve Fleet)</option>
                <option value="MAINTENANCE">MAINTENANCE (Depot Inspection)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={adding || !name.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0047BA] hover:bg-[#003994] disabled:bg-slate-300 text-white font-semibold shadow-sm transition"
            >
              {adding ? 'Registering Train...' : 'Commission Train'}
            </button>
          </form>
        </div>

        {/* Fleet Monitor Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trains.map((t) => {
              const isService = t.status === 'IN_SERVICE';
              const occPercent = t.capacity > 0 ? (t.currentPassengers / t.capacity) * 100 : 0;
              return (
                <div key={t.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-xs font-bold text-[#0047BA]">#{t.id}</span>
                          <h4 className="font-bold text-sm text-[#0F172A]">{t.name}</h4>
                        </div>
                        <span className="text-[11px] text-[#64748B]">Capacity: {t.capacity} Commuters</span>
                      </div>

                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isService ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    {/* Visual Load Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-mono text-[#334155] mb-1">
                        <span>Occupancy: {t.currentPassengers} / {t.capacity}</span>
                        <span className="font-bold">{occPercent.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            occPercent >= 90 ? 'bg-red-500' : occPercent >= 70 ? 'bg-amber-500' : 'bg-[#0047BA]'
                          }`}
                          style={{ width: `${Math.min(occPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                    <span className="text-[#64748B]">Available: <strong className="text-emerald-700">{t.capacity - t.currentPassengers} seats</strong></span>
                    {isAdmin && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                          title="Edit Train"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrain(t.id)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                          title="Retire Train"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-[#0047BA] shrink-0" />
            <div>
              <span className="font-bold">Zero-Overbooking Guarantee:</span>
              <p className="text-[11px] text-blue-800">
                The transit system guarantees no ticket can be issued if passenger load reaches train capacity limits.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Train Modal */}
      {editingTrain && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900">Edit Train #{editingTrain.id}</h3>
            <form onSubmit={handleUpdateTrain} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Train Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Passenger Capacity</label>
                <input
                  type="number"
                  min={editingTrain.currentPassengers}
                  max={1000}
                  required
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">Must be ≥ current onboard passengers ({editingTrain.currentPassengers})</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operational Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="IN_SERVICE">IN_SERVICE</option>
                  <option value="STANDBY">STANDBY</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTrain(null)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#0047BA] text-white font-bold rounded-lg hover:bg-blue-600 transition"
                >
                  Save Train
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
