import React, { useState, useEffect } from 'react';
import { Schedule } from '../types/metro';
import { api } from '../services/api';
import { Clock, Plus, Trash2, Edit3, AlertCircle, Calendar, RefreshCw } from 'lucide-react';

interface SchedulesPageProps {
  isAdmin?: boolean;
}

export const SchedulesPage: React.FC<SchedulesPageProps> = ({ isAdmin = false }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    line: 'Orange Line',
    origin: '',
    destination: '',
    firstTrain: '06:00',
    lastTrain: '22:30',
    frequencyPeak: '6 mins',
    frequencyOffPeak: '12 mins',
    operatingDays: 'Monday - Sunday',
    stopsCount: 18,
    averageTravelTime: '38 mins'
  });

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await api.getSchedules();
      setSchedules(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const openCreateModal = () => {
    setEditingSchedule(null);
    setFormData({
      line: 'Orange Line',
      origin: '',
      destination: '',
      firstTrain: '06:00',
      lastTrain: '22:30',
      frequencyPeak: '6 mins',
      frequencyOffPeak: '12 mins',
      operatingDays: 'Monday - Sunday',
      stopsCount: 18,
      averageTravelTime: '38 mins'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sch: Schedule) => {
    setEditingSchedule(sch);
    setFormData({
      line: sch.line,
      origin: sch.origin,
      destination: sch.destination,
      firstTrain: sch.firstTrain,
      lastTrain: sch.lastTrain,
      frequencyPeak: sch.frequencyPeak,
      frequencyOffPeak: sch.frequencyOffPeak,
      operatingDays: sch.operatingDays,
      stopsCount: sch.stopsCount,
      averageTravelTime: sch.averageTravelTime
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await api.updateSchedule(editingSchedule.id, formData);
      } else {
        await api.addSchedule(formData);
      }
      setIsModalOpen(false);
      fetchSchedules();
    } catch (err: any) {
      alert(err.message || 'Error saving schedule');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Delete this schedule #${id}?`)) return;
    try {
      await api.deleteSchedule(id);
      fetchSchedules();
    } catch (err: any) {
      alert(err.message || 'Error deleting schedule');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047BA] flex items-center justify-center border border-blue-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isAdmin ? 'Train Timings & Schedule Management' : 'Train Timings & Schedules'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAdmin
                ? 'Manage operating timetables, first & last departure timings, and corridor frequencies.'
                : 'Real-time operating timetables, peak/off-peak frequencies, and transit durations across all lines.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchSchedules}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh Schedules"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="px-3.5 py-2 rounded-xl bg-[#0047BA] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Schedule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((sch) => {
          const isOrange = sch.line.includes('Orange');
          return (
            <div
              key={sch.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-blue-400 transition"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                    isOrange ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                  }`}>
                    {sch.line}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{sch.operatingDays}</span>
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-slate-900">{sch.origin} ➔ {sch.destination}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{sch.stopsCount} intermediate stops • Approx. {sch.averageTravelTime}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">First Train</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{sch.firstTrain} AM</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Train</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{sch.lastTrain} PM</span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/60 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Peak Frequency:</span>
                    <span className="font-bold text-[#0047BA]">Every {sch.frequencyPeak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Off-Peak Frequency:</span>
                    <span className="font-bold text-slate-700">Every {sch.frequencyOffPeak}</span>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => openEditModal(sch)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                    title="Edit Schedule"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(sch.id)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                    title="Delete Schedule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Admin Add / Edit Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              {editingSchedule ? 'Edit Schedule Timing' : 'Add New Corridor Schedule'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corridor Line</label>
                  <select
                    value={formData.line}
                    onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Orange Line">Orange Line</option>
                    <option value="Aqua Line">Aqua Line</option>
                    <option value="Orange Express Shuttle">Orange Express Shuttle</option>
                    <option value="Airport Feeder Loop">Airport Feeder Loop</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operating Days</label>
                  <input
                    type="text"
                    value={formData.operatingDays}
                    onChange={(e) => setFormData({ ...formData, operatingDays: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. Monday - Sunday"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin Terminal</label>
                  <input
                    type="text"
                    required
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. Automotive Square"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination Terminal</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. Khapri"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Departure</label>
                  <input
                    type="text"
                    value={formData.firstTrain}
                    onChange={(e) => setFormData({ ...formData, firstTrain: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="06:00"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Departure</label>
                  <input
                    type="text"
                    value={formData.lastTrain}
                    onChange={(e) => setFormData({ ...formData, lastTrain: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="22:30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peak Frequency</label>
                  <input
                    type="text"
                    value={formData.frequencyPeak}
                    onChange={(e) => setFormData({ ...formData, frequencyPeak: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. 6 mins"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Off-Peak Frequency</label>
                  <input
                    type="text"
                    value={formData.frequencyOffPeak}
                    onChange={(e) => setFormData({ ...formData, frequencyOffPeak: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. 12 mins"
                  />
                </div>
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
                  {editingSchedule ? 'Save Changes' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
