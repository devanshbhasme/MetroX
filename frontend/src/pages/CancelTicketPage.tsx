import React, { useState } from 'react';
import { Ticket } from '../types/metro';
import { api } from '../services/api';
import { AlertTriangle, CheckCircle2, Ticket as TicketIcon, RotateCcw, Search, ShieldCheck } from 'lucide-react';

interface CancelTicketPageProps {
  tickets: Ticket[];
  onRefresh: () => void;
}

export const CancelTicketPage: React.FC<CancelTicketPageProps> = ({ tickets, onRefresh }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; refundAmount: number; releasedTrainId: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const confirmedTickets = tickets.filter(t => t.bookingStatus === 'CONFIRMED');
  const filteredTickets = confirmedTickets.filter(t => 
    t.ticketId.toString().includes(searchQuery) ||
    t.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.sourceStationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.destinationStationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTicket = confirmedTickets.find(t => t.ticketId === Number(selectedTicketId));

  const handleCancel = async () => {
    if (!selectedTicketId) return;
    setCancelling(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.cancelTicket(Number(selectedTicketId));
      setResult(res);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel ticket');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Cancel Metro Ticket & Instant Refund</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant cancellation for active confirmed tickets. Automatically releases reserved seat and processes refund to original payment source.
            </p>
          </div>
        </div>
      </div>

      {/* Cancellation Status Outcome */}
      {result && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-xs space-y-3">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h3 className="font-bold text-base">Ticket Successfully Cancelled</h3>
              <p className="text-xs text-emerald-800">{result.message}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-white rounded-xl border border-emerald-200">
              <span className="text-slate-500 block">Refund Amount</span>
              <span className="text-base font-bold text-emerald-700">₹{result.refundAmount.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-emerald-200">
              <span className="text-slate-500 block">Train Capacity Restored</span>
              <span className="text-base font-bold text-slate-800">Train #{result.releasedTrainId}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-emerald-200">
              <span className="text-slate-500 block">Status</span>
              <span className="text-xs font-bold text-rose-600 uppercase">CANCELLED (Refunded)</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center space-x-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Cancellation Panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left: Ticket Selection List */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <TicketIcon className="w-4 h-4 text-[#0047BA]" />
              <span>Active Confirmed Tickets</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {confirmedTickets.length} Eligible
            </span>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Ticket ID, Passenger, or Station..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t) => {
                const isSelected = Number(selectedTicketId) === t.ticketId;
                return (
                  <button
                    key={t.ticketId}
                    type="button"
                    onClick={() => setSelectedTicketId(t.ticketId)}
                    className={`w-full text-left p-3.5 rounded-xl border transition ${
                      isSelected
                        ? 'border-[#0047BA] bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#0047BA]">Ticket #{t.ticketId}</span>
                      <span className="font-bold text-xs text-slate-900">₹{t.finalFare.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-slate-700 mt-1 font-medium">
                      {t.sourceStationName} ➔ {t.destinationStationName}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>Passenger: {t.passengerName} ({t.passengerType})</span>
                      <span>Paid via {t.paymentMethod}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No active confirmed tickets available for cancellation.
              </div>
            )}
          </div>
        </div>

        {/* Right: Cancellation Review & Confirmation */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100">
              Cancellation Summary
            </h3>

            {activeTicket ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ticket ID</span>
                    <span className="font-mono font-bold text-slate-800">#{activeTicket.ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Passenger</span>
                    <span className="font-semibold text-slate-800">{activeTicket.passengerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Journey</span>
                    <span className="font-semibold text-slate-800 text-right">{activeTicket.sourceStationName} ➔ {activeTicket.destinationStationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Train</span>
                    <span className="font-semibold text-slate-800">{activeTicket.trainName}</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200/60 space-y-1.5">
                  <div className="flex justify-between text-rose-900 font-bold">
                    <span>Fare Paid:</span>
                    <span>₹{activeTicket.finalFare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-rose-700 text-[11px]">
                    <span>Cancellation Fee:</span>
                    <span>₹0.00 (Zero Fee)</span>
                  </div>
                  <div className="pt-1.5 border-t border-rose-200 flex justify-between font-bold text-rose-900">
                    <span>Refund Due:</span>
                    <span className="text-sm font-black text-emerald-700">₹{activeTicket.finalFare.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Refund processed instantly through {activeTicket.paymentMethod} simulator.</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Please select a ticket from the list on the left to review cancellation details.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={handleCancel}
              disabled={!activeTicket || cancelling}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${cancelling ? 'animate-spin' : ''}`} />
              <span>{cancelling ? 'Processing Cancellation...' : 'Confirm Ticket Cancellation'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
