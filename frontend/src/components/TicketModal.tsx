import React from 'react';
import { CheckCircle2, QrCode, Train, Calendar, ArrowRight, X, Printer } from 'lucide-react';
import { BookingResponse } from '../types/metro';

interface TicketModalProps {
  booking: BookingResponse | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
  if (!booking || !booking.success) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E2E8F0] overflow-hidden transform transition-all">
        
        {/* Top Header */}
        <div className="bg-[#0047BA] text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Booking Confirmed • Boarding Pass</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">MetroX Transit Pass</h2>
          <p className="text-sm text-blue-100 font-mono mt-0.5">Ticket ID: #{booking.ticketId}</p>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-6 space-y-6">
          
          {/* Journey Route Visualizer */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] font-semibold uppercase text-[#64748B]">Origin Station</span>
              <p className="text-base font-bold text-[#0F172A]">{booking.sourceName || 'Station A'}</p>
            </div>
            
            <div className="flex flex-col items-center px-4">
              <div className="flex items-center space-x-1 text-[#0047BA]">
                <div className="w-2 h-2 rounded-full bg-[#0047BA]" />
                <div className="w-12 h-0.5 bg-[#0047BA]/40" />
                <ArrowRight className="w-4 h-4" />
                <div className="w-2 h-2 rounded-full bg-[#0047BA]" />
              </div>
              <span className="text-[10px] font-medium text-[#64748B] mt-1">Confirmed Path</span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold uppercase text-[#64748B]">Destination</span>
              <p className="text-base font-bold text-[#0F172A]">{booking.destName || 'Station B'}</p>
            </div>
          </div>

          {/* Commuter & Fleet Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="border border-[#E2E8F0] rounded-lg p-3 bg-white">
              <span className="text-xs text-[#64748B] block">Passenger Name</span>
              <span className="font-semibold text-[#0F172A]">{booking.passengerName}</span>
              <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-[#0047BA] border border-blue-200">
                {booking.passengerType}
              </span>
            </div>

            <div className="border border-[#E2E8F0] rounded-lg p-3 bg-white">
              <span className="text-xs text-[#64748B] block">Assigned Train</span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <Train className="w-4 h-4 text-[#0047BA]" />
                <span className="font-semibold text-[#0F172A]">{booking.trainName}</span>
              </div>
              <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Seat Reserved (1)
              </span>
            </div>
          </div>

          {/* Payment & Fare Receipt */}
          <div className="bg-[#F1F5F9] rounded-xl p-4 flex items-center justify-between border border-[#E2E8F0]">
            <div>
              <span className="text-xs text-[#64748B] block">Total Amount Paid</span>
              <span className="text-2xl font-extrabold text-[#0047BA] font-mono">
                ₹{Number(booking.fare).toFixed(2)}
              </span>
              {booking.change && booking.change > 0 ? (
                <span className="block text-xs font-semibold text-emerald-700">
                  Change Returned: ₹{Number(booking.change).toFixed(2)}
                </span>
              ) : null}
            </div>

            <div className="w-16 h-16 bg-white border border-[#CBD5E1] rounded-lg flex items-center justify-center p-1 shadow-inner">
              <QrCode className="w-12 h-12 text-[#0F172A]" />
            </div>
          </div>

          {/* Verification Code */}
          <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-dashed border-[#CBD5E1]">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Valid for departure today</span>
            </div>
            <span className="font-mono uppercase tracking-wider">C++ VERIFIED GATE PASS</span>
          </div>

        </div>

        {/* Actions Footer */}
        <div className="bg-[#F8FAFC] px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 text-xs font-semibold text-[#334155] hover:text-[#0F172A] px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white transition hover:bg-slate-50"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#0047BA] hover:bg-[#003994] rounded-lg shadow-sm transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
