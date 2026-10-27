import React, { useState, useEffect } from 'react';
import { TransitAlert } from '../types/metro';
import { api } from '../services/api';
import { Plus, Trash2, CheckCircle2, Clock, ShieldAlert, RefreshCw } from 'lucide-react';

interface AlertsPageProps {
  isAdmin?: boolean;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ isAdmin = false }) => {
  const [alerts, setAlerts] = useState<TransitAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLine, setFilterLine] = useState('ALL');

  // Admin Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [line, setLine] = useState('All Lines');
  const [type, setType] = useState<'DELAY' | 'MAINTENANCE' | 'GENERAL'>('DELAY');
  const [severity, setSeverity] = useState<'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS'>('WARNING');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (e) {
      console.warn('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      await api.addAlert({ line, type, severity, title, description, status: 'ACTIVE' });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      fetchAlerts();
    } catch (err: any) {
      window.alert(err.message || 'Error posting alert');
    }
  };

  const handleToggleStatus = async (alertItem: TransitAlert) => {
    const nextStatus = alertItem.status === 'ACTIVE' ? 'RESOLVED' : 'ACTIVE';
    try {
      await api.updateAlert(alertItem.id, { status: nextStatus });
      fetchAlerts();
    } catch (err: any) {
      window.alert(err.message || 'Error updating alert status');
    }
  };

  const handleDeleteAlert = async (id: number) => {
    if (!window.confirm('Delete this alert announcement?')) return;
    try {
      await api.deleteAlert(id);
      fetchAlerts();
    } catch (err: any) {
      alert(err.message || 'Error deleting alert');
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterLine === 'ALL') return true;
    return a.line.includes(filterLine);
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">CRITICAL</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">DELAY / ADVISORY</span>;
      case 'SUCCESS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">ALL CLEAR</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">INFO</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isAdmin ? 'Service Alerts & Maintenance Management' : 'Service Alerts & Delays'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAdmin
                ? 'Issue official passenger advisories, post track maintenance warnings, and broadcast line status.'
                : 'Real-time operational alerts, track maintenance notices, and corridor pacing updates.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchAlerts}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh Alerts"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0047BA] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Corridor Filters */}
      <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold w-fit">
        <button
          onClick={() => setFilterLine('ALL')}
          className={`px-3 py-1.5 rounded-lg transition ${filterLine === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
        >
          All Corridors ({alerts.length})
        </button>
        <button
          onClick={() => setFilterLine('Orange')}
          className={`px-3 py-1.5 rounded-lg transition ${filterLine === 'Orange' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-orange-600'}`}
        >
          Orange Line
        </button>
        <button
          onClick={() => setFilterLine('Aqua')}
          className={`px-3 py-1.5 rounded-lg transition ${filterLine === 'Aqua' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-cyan-600'}`}
        >
          Aqua Line
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alt) => {
            const isResolved = alt.status === 'RESOLVED';
            return (
              <div
                key={alt.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition flex flex-col sm:flex-row items-start justify-between gap-4 ${
                  isResolved ? 'opacity-60 border-slate-200 bg-slate-50/50' : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(alt.severity)}
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {alt.line}
                    </span>
                    {isResolved && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        RESOLVED
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{alt.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{alt.description}</p>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(alt.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleToggleStatus(alt)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
                        isResolved
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {isResolved ? 'Mark Active' : 'Mark Resolved'}
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(alt.id)}
                      className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                      title="Delete Alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No Active Service Disruptions</p>
            <p className="text-[11px] text-slate-400">Metro network operating normally across all routes and interchanges.</p>
          </div>
        )}
      </div>

      {/* Admin Broadcast Alert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Broadcast Transit Advisory Alert</h3>
            <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Advisory Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  placeholder="e.g. 5-minute pacing delay between Zero Mile & Sitabuldi"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Impacted Corridor</label>
                  <select
                    value={line}
                    onChange={(e) => setLine(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="All Lines">All Lines</option>
                    <option value="Orange Line">Orange Line</option>
                    <option value="Aqua Line">Aqua Line</option>
                    <option value="Sitabuldi Interchange">Sitabuldi Interchange</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="DELAY">Delay</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e: any) => setSeverity(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="WARNING">WARNING</option>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="INFO">INFO</option>
                    <option value="SUCCESS">SUCCESS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Passenger Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  placeholder="Explain cause, estimated duration, and passenger guidance..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0047BA] text-white rounded-lg font-bold hover:bg-blue-600 transition"
                >
                  Publish Alert to Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
