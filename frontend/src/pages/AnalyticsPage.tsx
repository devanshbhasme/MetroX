import React, { useState, useEffect } from 'react';
import { AnalyticsData } from '../types/metro';
import { api } from '../services/api';
import { BarChart3, TrendingUp, CreditCard, Users, RefreshCw, ArrowUpRight, ShieldCheck, Ticket } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics();
      setData(res);
    } catch (e) {
      console.warn('Analytics loading error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-[#0047BA] animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500">Compiling financial & booking analytics...</p>
      </div>
    );
  }

  const totalPayments = (data.paymentMethods.UPI || 0) + (data.paymentMethods.Card || 0) + (data.paymentMethods.Cash || 0) || 1;
  const upiPercent = Math.round(((data.paymentMethods.UPI || 0) / totalPayments) * 100);
  const cardPercent = Math.round(((data.paymentMethods.Card || 0) / totalPayments) * 100);
  const cashPercent = Math.round(((data.paymentMethods.Cash || 0) / totalPayments) * 100);

  const totalPassengers = (data.passengerTypes.Regular || 0) + (data.passengerTypes.Student || 0) + (data.passengerTypes['Senior Citizen'] || 0) || 1;
  const regPercent = Math.round(((data.passengerTypes.Regular || 0) / totalPassengers) * 100);
  const stuPercent = Math.round(((data.passengerTypes.Student || 0) / totalPassengers) * 100);
  const senPercent = Math.round(((data.passengerTypes['Senior Citizen'] || 0) / totalPassengers) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047BA] flex items-center justify-center border border-blue-200">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Revenue & Booking Analytics</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live financial oversight, corridor traffic demand, passenger demographic share, and payment distribution.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAnalytics}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition self-start sm:self-auto flex items-center space-x-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹{data.totalRevenue.toFixed(2)}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
            <ArrowUpRight className="w-3 h-3" />
            <span>From {data.confirmedCount} confirmed journeys</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Refunds Processed</span>
            <Ticket className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">₹{data.totalRefunded.toFixed(2)}</div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {data.cancelledCount} tickets cancelled ({data.cancellationRate}%)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Net System Revenue</span>
            <ShieldCheck className="w-4 h-4 text-[#0047BA]" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹{data.netRevenue.toFixed(2)}</div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            Realized after instant refunds
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Tickets Issued</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{data.totalTicketsIssued}</div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            Across {data.stationNetworkSize} stations network
          </p>
        </div>
      </div>

      {/* Two Column Visual Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Payment Channels Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-[#0047BA]" />
              <span>Payment Channel Share</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">100% Simulated</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span className="text-slate-700">UPI (Google Pay / PhonePe / QR)</span>
                <span className="text-slate-900 font-bold">{data.paymentMethods.UPI || 0} ({upiPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${upiPercent}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span className="text-slate-700">Credit / Debit Card Simulation</span>
                <span className="text-slate-900 font-bold">{data.paymentMethods.Card || 0} ({cardPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0047BA] rounded-full" style={{ width: `${cardPercent}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span className="text-slate-700">Cash / TVM Vending Counter</span>
                <span className="text-slate-900 font-bold">{data.paymentMethods.Cash || 0} ({cashPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${cashPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Demographic Share */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#0047BA]" />
              <span>Passenger Category Distribution</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{data.passengerBase} Registered</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span className="text-slate-700">Regular Passengers (Standard Fare)</span>
                <span className="text-slate-900 font-bold">{data.passengerTypes.Regular || 0} ({regPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-700 rounded-full" style={{ width: `${regPercent}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span className="text-slate-700">Students (20% Concession)</span>
                <span className="text-slate-900 font-bold">{data.passengerTypes.Student || 0} ({stuPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stuPercent}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span className="text-slate-700">Senior Citizens (30% Concession)</span>
                <span className="text-slate-900 font-bold">{data.passengerTypes['Senior Citizen'] || 0} ({senPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${senPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Top 5 Busiest Corridors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Top Busiest Origin-Destination Corridors</h3>
        {data.topRoutes && data.topRoutes.length > 0 ? (
          <div className="space-y-2 text-xs">
            {data.topRoutes.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0047BA] font-bold flex items-center justify-center text-xs">
                    #{i + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{r.route}</span>
                </div>
                <span className="font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  {r.count} Bookings
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">No journey booking data recorded yet.</p>
        )}
      </div>
    </div>
  );
};
