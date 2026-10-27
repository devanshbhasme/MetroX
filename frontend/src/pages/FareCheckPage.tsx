import React, { useState, useEffect } from 'react';
import { Station, FareConfig } from '../types/metro';
import { api } from '../services/api';
import { Calculator, ShieldCheck, Tag, Sparkles, Settings, CheckCircle2 } from 'lucide-react';

interface FareCheckPageProps {
  stations: Station[];
  isAdmin?: boolean;
}

export const FareCheckPage: React.FC<FareCheckPageProps> = ({ stations, isAdmin = false }) => {
  const [originId, setOriginId] = useState<number>(stations[0]?.id || 1);
  const [destId, setDestId] = useState<number>(stations[stations.length - 1]?.id || 2);
  const [fareConfig, setFareConfig] = useState<FareConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculation, setCalculation] = useState<{
    distance: number;
    hops: number;
    standardFare: number;
    studentFare: number;
    seniorFare: number;
    smartCardFare: number;
  } | null>(null);

  // Admin edit form
  const [adminBaseFare, setAdminBaseFare] = useState<number>(10);
  const [adminRatePerKm, setAdminRatePerKm] = useState<number>(3.5);
  const [adminStudentDisc, setAdminStudentDisc] = useState<number>(20);
  const [adminSeniorDisc, setAdminSeniorDisc] = useState<number>(30);
  const [adminMinFare, setAdminMinFare] = useState<number>(5);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchFares = async () => {
    try {
      const data = await api.getFares();
      setFareConfig(data);
      setAdminBaseFare(data.baseFare);
      setAdminRatePerKm(data.ratePerKm);
      setAdminStudentDisc(Math.round((data.discounts?.student || 0.20) * 100));
      setAdminSeniorDisc(Math.round((data.discounts?.senior || 0.30) * 100));
      setAdminMinFare(data.minFare || 5.0);
    } catch (e) {
      console.warn('Using default fare config');
    }
  };

  useEffect(() => {
    fetchFares();
  }, []);

  const calculateJourneyFare = async () => {
    if (!originId || !destId || originId === destId) {
      setCalculation(null);
      return;
    }
    setLoading(true);
    try {
      const routeRes = await api.findRoute(originId, destId, 'dijkstra');
      const dist = routeRes.distance || 5.0;
      const base = fareConfig?.baseFare ?? adminBaseFare;
      const rate = fareConfig?.ratePerKm ?? adminRatePerKm;
      const minF = fareConfig?.minFare ?? adminMinFare;

      const raw = base + (rate * dist);
      const std = Math.max(raw, minF);
      const student = Math.max(raw * (1 - (adminStudentDisc / 100)), minF);
      const senior = Math.max(raw * (1 - (adminSeniorDisc / 100)), minF);
      const smart = Math.max(std * 0.95, minF);

      setCalculation({
        distance: parseFloat(dist.toFixed(2)),
        hops: routeRes.hops || Math.max(routeRes.path?.length - 1, 1),
        standardFare: parseFloat(std.toFixed(2)),
        studentFare: parseFloat(student.toFixed(2)),
        seniorFare: parseFloat(senior.toFixed(2)),
        smartCardFare: parseFloat(smart.toFixed(2))
      });
    } catch (err) {
      console.error('Route calculation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateJourneyFare();
  }, [originId, destId, fareConfig]);

  const handleAdminSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateFares({
        baseFare: adminBaseFare,
        ratePerKm: adminRatePerKm,
        minFare: adminMinFare,
        discounts: {
          student: adminStudentDisc / 100,
          senior: adminSeniorDisc / 100,
          weekendPromo: 0.10,
          smartCardBonus: 0.05
        }
      });
      setSaveSuccess(true);
      fetchFares();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating fares');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047BA] flex items-center justify-center border border-blue-200">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isAdmin ? 'Transit Fare Management & Matrix' : 'Check Fare Between Stations'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAdmin
                ? 'Configure transit authority base fares, distance-based slab coefficients, and statutory concession percentages.'
                : 'Instant ticket fare calculator with exact track distances and concession rates for Students and Senior Citizens.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Fare Calculator */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#0047BA]" />
              <span>Journey Fare Inquiry</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Dijkstra Shortest Track Path</span>
          </div>

          {/* Station Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Origin Station</label>
              <select
                value={originId}
                onChange={(e) => setOriginId(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:ring-2 focus:ring-blue-500"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.id} {s.name} ({s.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Destination Station</label>
              <select
                value={destId}
                onChange={(e) => setDestId(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:ring-2 focus:ring-blue-500"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.id} {s.name} ({s.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fare Breakdown Cards */}
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
              Calculating journey fare...
            </div>
          ) : calculation ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Track Distance</span>
                  <span className="text-slate-900 text-sm font-bold">{calculation.distance} km</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Station Stops</span>
                  <span className="text-slate-900 text-sm font-bold">{calculation.hops} hops</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Base Tariff</span>
                  <span className="text-slate-900 text-sm font-bold">₹{adminBaseFare} + ₹{adminRatePerKm}/km</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Standard Fare */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Regular Passenger</span>
                  <div className="text-2xl font-black text-slate-900">₹{calculation.standardFare.toFixed(2)}</div>
                  <p className="text-[11px] text-slate-500">Standard point-to-point tariff without concession.</p>
                </div>

                {/* Student Concession */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 shadow-xs space-y-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    Student ({adminStudentDisc}% Off)
                  </span>
                  <div className="text-2xl font-black text-[#0047BA]">₹{calculation.studentFare.toFixed(2)}</div>
                  <p className="text-[11px] text-slate-500">Applies with valid college/school photo ID card.</p>
                </div>

                {/* Senior Citizen Concession */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-xs space-y-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Senior Citizen ({adminSeniorDisc}% Off)
                  </span>
                  <div className="text-2xl font-black text-emerald-700">₹{calculation.seniorFare.toFixed(2)}</div>
                  <p className="text-[11px] text-slate-500">Applies for passengers aged 60+ years with ID proof.</p>
                </div>
              </div>

              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-amber-900 font-semibold">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>Smart Card Bonus Rate: ₹{calculation.smartCardFare.toFixed(2)}</span>
                </div>
                <span className="text-[11px] text-amber-700 font-bold">5% Extra Auto-Discount</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              Select origin and destination stations above to calculate accurate tariff.
            </div>
          )}
        </div>

        {/* Right 1 Col: Admin Settings or Rules Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          {isAdmin ? (
            <form onSubmit={handleAdminSave} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                  <Settings className="w-4 h-4 text-[#0047BA]" />
                  <span>Authority Fare Controls</span>
                </h3>
              </div>

              {saveSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fare rules updated successfully!</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Minimum Fare (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={adminBaseFare}
                    onChange={(e) => setAdminBaseFare(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Per-Kilometer Rate (₹/km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={adminRatePerKm}
                    onChange={(e) => setAdminRatePerKm(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Student Disc (%)</label>
                    <input
                      type="number"
                      value={adminStudentDisc}
                      onChange={(e) => setAdminStudentDisc(parseInt(e.target.value, 10) || 0)}
                      className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Senior Disc (%)</label>
                    <input
                      type="number"
                      value={adminSeniorDisc}
                      onChange={(e) => setAdminSeniorDisc(parseInt(e.target.value, 10) || 0)}
                      className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Floor Minimum Fare (₹)</label>
                  <input
                    type="number"
                    value={adminMinFare}
                    onChange={(e) => setAdminMinFare(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0047BA] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition"
              >
                Apply Updated Fare Tariff
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Fare Policy & Concession Rules</span>
              </h3>
              <ul className="space-y-2.5 text-slate-600">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0047BA] mt-1.5 shrink-0"></span>
                  <span><strong>Base Fare:</strong> ₹10.00 flat boarding tariff covers first 2 km of transit.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0047BA] mt-1.5 shrink-0"></span>
                  <span><strong>Track Rate:</strong> ₹3.50/km calculated dynamically along the shortest Dijkstra graph.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0047BA] mt-1.5 shrink-0"></span>
                  <span><strong>Student Pass:</strong> 20% discount on all single and return journey tokens.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0047BA] mt-1.5 shrink-0"></span>
                  <span><strong>Senior Citizens:</strong> 30% discount automatically factored upon passenger selection.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0047BA] mt-1.5 shrink-0"></span>
                  <span><strong>No Surcharge:</strong> Zero platform or interchange interchange switching charges at Sitabuldi.</span>
                </li>
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-400">
            Nagpur Smart Transit Authority • Regulated Tariffs
          </div>
        </div>

      </div>
    </div>
  );
};
