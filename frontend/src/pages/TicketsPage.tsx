import React, { useState } from 'react';
import { 
  Ticket as TicketIcon, 
  ArrowRight, 
  XCircle, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw
} from 'lucide-react';
import { Ticket } from '../types/metro';
import { api } from '../services/api';

interface TicketsPageProps {
  tickets: Ticket[];
  onRefresh: () => void;
}

export const TicketsPage: React.FC<TicketsPageProps> = ({ tickets, onRefresh }) => {
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelModalTicket, setCancelModalTicket] = useState<Ticket | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);
  const [cancelErrorMsg, setCancelErrorMsg] = useState<string | null>(null);

  const filteredTickets = tickets.filter(t => {
    if (filter === 'CONFIRMED') return t.bookingStatus === 'CONFIRMED';
    if (filter === 'CANCELLED') return t.bookingStatus === 'CANCELLED';
    return true;
  });

  const handleConfirmCancel = async () => {
    if (!cancelModalTicket) return;

    setCancellingId(cancelModalTicket.ticketId);
    setCancelSuccessMsg(null);
    setCancelErrorMsg(null);

    try {
      const outcome = await api.cancelTicket(cancelModalTicket.ticketId);
      if (outcome.success) {
        setCancelSuccessMsg(
          `Ticket #${cancelModalTicket.ticketId} cancelled. Refund of ₹${Number(outcome.refundAmount).toFixed(2)} processed and train seat released.`
        );
        setCancelModalTicket(null);
        onRefresh();
      } else {
        setCancelErrorMsg(outcome.message || 'Cancellation rejected.');
      }
    } catch (err: any) {
      setCancelErrorMsg(err.message || 'Failed to cancel ticket.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#0047BA] uppercase tracking-wider mb-1">
            <TicketIcon className="w-4 h-4" />
            <span>Transit Voucher Ledger</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Issued Transit Tickets</h1>
          <p className="text-sm text-[#64748B]">
            Audit history of confirmed and refunded tickets with real-time seat release back to the C++ fleet.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-white border border-[#E2E8F0] rounded-xl self-start">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'ALL' ? 'bg-[#0047BA] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            All ({tickets.length})
          </button>
          <button
            onClick={() => setFilter('CONFIRMED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'CONFIRMED' ? 'bg-[#0047BA] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Confirmed ({tickets.filter(t => t.bookingStatus === 'CONFIRMED').length})
          </button>
          <button
            onClick={() => setFilter('CANCELLED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'CANCELLED' ? 'bg-[#0047BA] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Cancelled ({tickets.filter(t => t.bookingStatus === 'CANCELLED').length})
          </button>
        </div>
      </div>

      {cancelSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{cancelSuccessMsg}</span>
        </div>
      )}

      {cancelErrorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-xs font-semibold text-red-800 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{cancelErrorMsg}</span>
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-[#64748B] space-y-2">
            <TicketIcon className="w-12 h-12 text-[#CBD5E1] mx-auto" />
            <h3 className="font-bold text-base text-[#0F172A]">No Tickets Found</h3>
            <p className="text-xs">No transit tickets match the selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Ticket</th>
                  <th className="py-3.5 px-4">Passenger</th>
                  <th className="py-3.5 px-4">Route & Distance</th>
                  <th className="py-3.5 px-4">Assigned Train</th>
                  <th className="py-3.5 px-4">Fare & Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredTickets.map((t) => {
                  const isConfirmed = t.bookingStatus === 'CONFIRMED';
                  return (
                    <tr key={t.ticketId} className="hover:bg-[#F8FAFC] transition">
                      
                      {/* Ticket ID */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[#0047BA]">#{t.ticketId}</span>
                        {t.bookingTime && (
                          <span className="block text-[10px] text-[#94A3B8] mt-0.5">{t.bookingTime}</span>
                        )}
                      </td>

                      {/* Commuter */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#0F172A] block">{t.passengerName}</span>
                        <span className="text-[11px] text-[#64748B]">{t.passengerType}</span>
                      </td>

                      {/* Journey */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5 font-semibold text-[#0F172A]">
                          <span>{t.sourceStationName}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#0047BA]" />
                          <span>{t.destinationStationName}</span>
                        </div>
                        <span className="text-[11px] font-mono text-[#64748B] block mt-0.5">
                          {t.distance.toFixed(2)} km
                        </span>
                      </td>

                      {/* Train */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#334155]">{t.trainName}</span>
                        <span className="text-[11px] text-[#94A3B8] block">ID #{t.trainId}</span>
                      </td>

                      {/* Financials */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-sm text-[#0F172A]">
                          ₹{Number(t.finalFare).toFixed(2)}
                        </span>
                        <span className="text-[11px] text-[#64748B] block">
                          via {t.paymentMethod} {t.discountPercent > 0 ? `(${t.discountPercent.toFixed(0)}% off)` : ''}
                        </span>
                      </td>

                      {/* Status Badges */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isConfirmed 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {isConfirmed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{t.bookingStatus}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isConfirmed ? (
                          <button
                            onClick={() => setCancelModalTicket(t)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 rounded-lg transition"
                          >
                            Cancel Ticket
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#94A3B8] italic font-mono">Seat Released</span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModalTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">Confirm Cancellation</h3>
                <span className="text-xs text-[#64748B]">Ticket Voucher #{cancelModalTicket.ticketId}</span>
              </div>
            </div>

            <p className="text-xs text-[#334155] leading-relaxed">
              Cancelling will release <strong>1 seat</strong> back onto <strong>{cancelModalTicket.trainName}</strong> and issue a full refund of <strong className="font-mono text-emerald-700">₹{Number(cancelModalTicket.finalFare).toFixed(2)}</strong> via original payment method ({cancelModalTicket.paymentMethod}).
            </p>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs text-[#64748B] space-y-1">
              <div>Passenger: <strong className="text-[#0F172A]">{cancelModalTicket.passengerName}</strong></div>
              <div>Journey: <strong className="text-[#0F172A]">{cancelModalTicket.sourceStationName} → {cancelModalTicket.destinationStationName}</strong></div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalTicket(null)}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-100 rounded-lg"
              >
                Keep Ticket
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancellingId !== null}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
              >
                {cancellingId ? 'Processing Refund...' : 'Confirm & Release Seat'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
