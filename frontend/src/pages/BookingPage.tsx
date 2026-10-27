import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Train as TrainIcon, 
  CreditCard, 
  Smartphone, 
  Coins, 
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  Calculator,
  ShieldCheck
} from 'lucide-react';
import { Station, Train, Passenger, RouteFindingResponse, FareCalculationResponse, BookingResponse } from '../types/metro';
import { api } from '../services/api';
import { TicketModal } from '../components/TicketModal';

interface BookingPageProps {
  stations: Station[];
  trains: Train[];
  passengers: Passenger[];
  onBookingSuccess: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ 
  stations, 
  trains, 
  passengers, 
  onBookingSuccess 
}) => {
  const [selectedPassengerId, setSelectedPassengerId] = useState<number>(passengers[0]?.id || 1);
  const [sourceId, setSourceId] = useState<number>(stations[0]?.id || 1);
  const [destId, setDestId] = useState<number>(stations[1]?.id || 2);
  const [routeMode, setRouteMode] = useState<'dijkstra' | 'bfs'>('dijkstra');
  const [selectedTrainId, setSelectedTrainId] = useState<number>(trains[0]?.id || 101);

  // Computed state from C++
  const [routeData, setRouteData] = useState<RouteFindingResponse | null>(null);
  const [fareData, setFareData] = useState<FareCalculationResponse | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Payment inputs
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash'>('UPI');
  const [upiId, setUpiId] = useState('commuter@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532112233445566');
  const [cardHolder, setCardHolder] = useState('Alex Morgan');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [cashTendered, setCashTendered] = useState<number>(60);

  // Booking outcome
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingResponse | null>(null);

  const selectedPassenger = passengers.find(p => p.id === selectedPassengerId) || passengers[0];
  const eligibleTrains = trains.filter(t => t.status === 'IN_SERVICE' && t.availableCapacity > 0);

  // Automatically fetch route & calculate fare when journey endpoints change
  useEffect(() => {
    if (sourceId && destId && sourceId !== destId) {
      fetchRouteAndFare();
    } else {
      setRouteData(null);
      setFareData(null);
      if (sourceId === destId) {
        setRouteError('Origin and destination stations must be distinct.');
      }
    }
  }, [sourceId, destId, routeMode, selectedPassengerId]);

  const fetchRouteAndFare = async () => {
    setRouteLoading(true);
    setRouteError(null);
    try {
      const rData = await api.findRoute(sourceId, destId, routeMode);
      setRouteData(rData);

      const fData = await api.calculateFare(rData.distance, selectedPassengerId);
      setFareData(fData);
      
      // Update cash tendered default to cover fare rounded up
      if (fData?.finalFare) {
        setCashTendered(Math.ceil(fData.finalFare / 10) * 10);
      }
    } catch (err: any) {
      setRouteError(err.message || 'No connected rail path between the selected stations.');
      setRouteData(null);
      setFareData(null);
    } finally {
      setRouteLoading(false);
    }
  };

  const handleBookTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainId) {
      setBookingError('Please select a train in service with available seats.');
      return;
    }
    if (!fareData) {
      setBookingError('Valid route and fare calculation required.');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      const outcome = await api.bookTicket({
        passengerId: selectedPassengerId,
        sourceStationId: sourceId,
        destinationStationId: destId,
        trainId: selectedTrainId,
        paymentMethod,
        upiId: paymentMethod === 'UPI' ? upiId : undefined,
        cardNumber: paymentMethod === 'Card' ? cardNumber : undefined,
        cardHolder: paymentMethod === 'Card' ? cardHolder : undefined,
        cardExp: paymentMethod === 'Card' ? cardExp : undefined,
        cardCvv: paymentMethod === 'Card' ? cardCvv : undefined,
        cashTendered: paymentMethod === 'Cash' ? Number(cashTendered) : undefined,
      });

      if (outcome.success) {
        setConfirmedBooking(outcome);
        onBookingSuccess();
      } else {
        setBookingError(outcome.error || outcome.message || 'Payment or booking was not approved.');
      }
    } catch (err: any) {
      setBookingError(err.message || 'Transaction failed. Please verify payment details.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#0047BA] uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Automated Ticketing & Routing</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Book Transit Pass</h1>
        <p className="text-sm text-[#64748B]">
          Compute shortest rail distance or minimum stops, verify real-time seat availability, and simulate payment via UPI, Card, or Cash.
        </p>
      </div>

      <form onSubmit={handleBookTicket} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Form Selection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Passenger Selection */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0047BA] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">Commuter & Concession Category</h3>
              </div>
              {selectedPassenger && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0047BA] border border-blue-200">
                  {selectedPassenger.type} ({selectedPassenger.discountPercent}% Concession)
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                Select Registered Commuter
              </label>
              <select
                value={selectedPassengerId}
                onChange={(e) => setSelectedPassengerId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#0047BA] transition"
              >
                {passengers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.type} ({p.discountPercent > 0 ? `${p.discountPercent}% off` : 'Standard'})
                  </option>
                ))}
              </select>
            </div>

            {selectedPassenger && (
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                <div className="flex justify-between text-[#64748B]">
                  <span>Email: <strong className="text-[#0F172A]">{selectedPassenger.email}</strong></span>
                  <span>ID: <strong className="font-mono text-[#0F172A]">#{selectedPassenger.id}</strong></span>
                </div>
                {selectedPassenger.collegeName && (
                  <div className="text-emerald-700 font-medium">
                    🎓 Student Verification: {selectedPassenger.collegeName} (Card: {selectedPassenger.studentCardId})
                  </div>
                )}
                {selectedPassenger.age && (
                  <div className="text-indigo-700 font-medium">
                    👴 Senior Verification: Age {selectedPassenger.age} (ID: {selectedPassenger.seniorCardId})
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Stations & Route Mode */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#E2E8F0]">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0047BA] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">Journey Stations & Pathfinding Algorithm</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Origin Station
                </label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#0047BA]"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>
                      [{st.id}] {st.name} ({st.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Destination Station
                </label>
                <select
                  value={destId}
                  onChange={(e) => setDestId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm font-medium text-[#0F172A] focus:outline-none focus:border-[#0047BA]"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>
                      [{st.id}] {st.name} ({st.location})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Algorithm Selector Radio */}
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-2">
                Pathfinding Optimization Strategy
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRouteMode('dijkstra')}
                  className={`p-3 rounded-xl border text-left transition ${
                    routeMode === 'dijkstra'
                      ? 'border-[#0047BA] bg-blue-50/50 text-[#0F172A]'
                      : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Dijkstra's Algorithm</span>
                    {routeMode === 'dijkstra' && <span className="w-2 h-2 rounded-full bg-[#0047BA]" />}
                  </div>
                  <span className="text-[11px] block mt-0.5 text-[#64748B]">Minimizes physical track km</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRouteMode('bfs')}
                  className={`p-3 rounded-xl border text-left transition ${
                    routeMode === 'bfs'
                      ? 'border-[#0047BA] bg-blue-50/50 text-[#0F172A]'
                      : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>BFS Traversal</span>
                    {routeMode === 'bfs' && <span className="w-2 h-2 rounded-full bg-[#0047BA]" />}
                  </div>
                  <span className="text-[11px] block mt-0.5 text-[#64748B]">Minimizes station stops/hops</span>
                </button>
              </div>
            </div>

            {/* Route path breadcrumbs preview */}
            {routeData && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-emerald-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Route Verified ({routeData.hops} Hops • {routeData.distance.toFixed(2)} km)</span>
                  </span>
                  <span className="font-mono text-[#64748B] text-[11px]">{routeData.algorithm}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E2E8F0]">
                  {routeData.pathStations.map((s, idx) => (
                    <React.Fragment key={s.id}>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] shadow-2xs">
                        {s.name}
                      </span>
                      {idx < routeData.pathStations.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-[#0047BA]" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {routeError && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs font-semibold text-red-700 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{routeError}</span>
              </div>
            )}
          </div>

          {/* Card 3: Train Fleet Assignment */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#E2E8F0]">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0047BA] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">Train Fleet & Capacity Validation</h3>
            </div>

            {eligibleTrains.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                All trains are currently full or out of service! Booking cannot proceed until train seats are released.
              </div>
            ) : (
              <div className="space-y-2">
                {eligibleTrains.map((train) => {
                  const isSelected = selectedTrainId === train.id;
                  return (
                    <label
                      key={train.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-[#0047BA] bg-blue-50/40 text-[#0F172A]'
                          : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="trainSelection"
                          checked={isSelected}
                          onChange={() => setSelectedTrainId(train.id)}
                          className="w-4 h-4 text-[#0047BA] focus:ring-[#0047BA]"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <TrainIcon className="w-4 h-4 text-[#0047BA]" />
                            <span className="font-bold text-xs text-[#0F172A]">{train.name}</span>
                          </div>
                          <span className="text-[11px] text-[#64748B]">Train ID #{train.id} • {train.status}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-700 font-mono">
                          {train.availableCapacity} seats open
                        </span>
                        <span className="text-[10px] text-[#64748B] block">
                          Capacity: {train.capacity}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card 4: Payment Gateway Simulation */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#E2E8F0]">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0047BA] flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">Simulated Payment Gateway</h3>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                  paymentMethod === 'UPI' ? 'border-[#0047BA] bg-[#0047BA] text-white shadow-sm' : 'border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                  paymentMethod === 'Card' ? 'border-[#0047BA] bg-[#0047BA] text-white shadow-sm' : 'border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card Simulation</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                  paymentMethod === 'Cash' ? 'border-[#0047BA] bg-[#0047BA] text-white shadow-sm' : 'border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC]'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Cash Counter</span>
              </button>
            </div>

            {/* UPI Form */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-[#334155]">
                  Virtual Payment Address (VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="user@upi or mobile@bank"
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-mono focus:outline-none focus:border-[#0047BA]"
                  required
                />
                <span className="text-[10px] text-[#64748B] block">
                  Simulates instant UPI push authorization and MPIN verification.
                </span>
              </div>
            )}

            {/* Card Form */}
            {paymentMethod === 'Card' && (
              <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Card Number (13-19 Digits)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 1122 3344 5566"
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-mono focus:outline-none focus:border-[#0047BA]"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[11px] font-semibold text-[#334155] mb-1">Cardholder</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#334155] mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#334155] mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cash Form */}
            {paymentMethod === 'Cash' && (
              <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Cash Tendered by Passenger (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min={fareData?.finalFare || 5}
                    value={cashTendered}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-sm font-mono font-bold focus:outline-none focus:border-[#0047BA]"
                    required
                  />
                </div>
                {fareData && (
                  <div className="flex justify-between text-xs text-[#334155] pt-2 border-t border-[#E2E8F0]">
                    <span>Billed: ₹{fareData.finalFare.toFixed(2)}</span>
                    <span className="font-bold text-emerald-700">
                      Change to Return: ₹{Math.max(cashTendered - fareData.finalFare, 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Right Col: Live Summary Receipt & Submit CTA */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-6">
            
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0047BA] pb-3 border-b border-[#E2E8F0]">
              <Calculator className="w-4 h-4" />
              <span>Fare & Journey Summary</span>
            </div>

            {/* Real-time Fare Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Base Fare (Flat)</span>
                <span className="font-mono text-[#0F172A]">₹10.00</span>
              </div>

              <div className="flex justify-between text-[#64748B]">
                <span>Distance Rate (₹3.50/km)</span>
                <span className="font-mono text-[#0F172A]">
                  {fareData ? `${fareData.distance.toFixed(2)} km` : '—'}
                </span>
              </div>

              <div className="flex justify-between text-[#64748B]">
                <span>Gross Fare</span>
                <span className="font-mono text-[#0F172A]">
                  ₹{fareData ? fareData.baseFare.toFixed(2) : '—'}
                </span>
              </div>

              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Concession ({selectedPassenger?.type || 'Standard'})</span>
                <span className="font-mono">
                  -₹{fareData ? fareData.discountAmount.toFixed(2) : '0.00'} ({fareData ? fareData.discountPercent.toFixed(0) : 0}%)
                </span>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">Total Payable</span>
                  <span className="text-[10px] text-[#64748B]">Includes seat reservation</span>
                </div>
                <span className="text-3xl font-extrabold font-mono text-[#0047BA]">
                  ₹{fareData ? fareData.finalFare.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            {bookingError && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={bookingLoading || routeLoading || !fareData || eligibleTrains.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0047BA] hover:bg-[#003994] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-sm transition active:scale-98"
            >
              {bookingLoading ? 'Authorizing Payment & Reserving Seat...' : 'Authorize & Issue Transit Pass'}
            </button>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Simulated gateway directly enforces seat limits in C++ memory.</span>
            </div>

          </div>
        </div>

      </form>

      {/* Confirmed Ticket Boarding Pass Modal */}
      <TicketModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />

    </div>
  );
};
