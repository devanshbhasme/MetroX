import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeftRight,
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  Calculator,
  ShieldCheck,
  User,
  GraduationCap,
  Sparkles,
  Clock,
  MapPin
} from 'lucide-react';
import { Station, Train, Passenger, RouteFindingResponse, FareCalculationResponse, BookingResponse, AuthUser } from '../types/metro';
import { api } from '../services/api';
import { TicketModal } from '../components/TicketModal';
import { PaymentGatewayModal, PaymentDetails } from '../components/PaymentGatewayModal';

interface BookingPageProps {
  stations: Station[];
  trains: Train[];
  passengers: Passenger[];
  onBookingSuccess: () => void;
  currentUser?: AuthUser | null;
  onBalanceUpdated?: (newBalance: number) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ 
  stations, 
  trains, 
  passengers, 
  onBookingSuccess,
  currentUser,
  onBalanceUpdated,
}) => {
  // Realistic Commuter Profile (Uses current logged-in user)
  const [concessionCategory, setConcessionCategory] = useState<'REGULAR' | 'STUDENT' | 'SENIOR'>('REGULAR');
  const [ticketType, setTicketType] = useState<'SJT' | 'RJT'>('SJT'); // Single or Return Journey

  // Journey station selection
  const [sourceId, setSourceId] = useState<number>(stations[0]?.id || 1);
  const [destId, setDestId] = useState<number>(stations[1]?.id || 2);
  const [routeMode, setRouteMode] = useState<'dijkstra' | 'bfs'>('dijkstra');
  const [selectedTrainId, setSelectedTrainId] = useState<number>(trains[0]?.id || 101);

  // Computed state from C++
  const [routeData, setRouteData] = useState<RouteFindingResponse | null>(null);
  const [fareData, setFareData] = useState<FareCalculationResponse | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Payment Gateway Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingResponse | null>(null);

  // Senior Citizen Aadhaar Age Verification State
  const [aadhaarNumber, setAadhaarNumber] = useState<string>(
    currentUser?.seniorId || '6543 8901 2345'
  );
  const [seniorAge, setSeniorAge] = useState<number>(currentUser?.age || 65);
  const [aadhaarError, setAadhaarError] = useState<string | null>(null);

  // Student Academic Email Verification State
  const [studentEmail, setStudentEmail] = useState<string>(() => {
    if (currentUser?.email && (currentUser.email.includes('.edu') || currentUser.email.includes('.ac'))) {
      return currentUser.email;
    }
    return 'david.chen@univ.edu';
  });
  const [collegeName, setCollegeName] = useState<string>(currentUser?.collegeName || 'National Institute of Tech');
  const [studentEmailError, setStudentEmailError] = useState<string | null>(null);

  const handleProceedToPayment = () => {
    setBookingError(null);
    setAadhaarError(null);
    setStudentEmailError(null);

    if (concessionCategory === 'SENIOR') {
      const rawAadhaar = aadhaarNumber.replace(/\D/g, '');
      if (rawAadhaar.length !== 12) {
        const msg = 'Senior citizen fare requires a valid 12-digit Aadhaar Card number for age verification.';
        setAadhaarError(msg);
        setBookingError(msg);
        return;
      }
      if (seniorAge < 60) {
        const msg = 'Age verification failed: Senior citizen concession requires age 60 or above as per Aadhaar Card.';
        setAadhaarError(msg);
        setBookingError(msg);
        return;
      }
    }

    if (concessionCategory === 'STUDENT') {
      const isEdu = studentEmail.includes('@') && /(\.edu|\.ac\.in|\.ac|\.edu\.in)/i.test(studentEmail);
      if (!isEdu) {
        const msg = 'Student concession requires a verified institutional email (e.g. ending in .edu or .ac.in).';
        setStudentEmailError(msg);
        setBookingError(msg);
        return;
      }
    }

    setIsPaymentModalOpen(true);
  };

  // Find passenger ID for C++ engine corresponding to concession category
  const activePassenger = React.useMemo(() => {
    const targetType = concessionCategory === 'STUDENT' ? 'Student' : (concessionCategory === 'SENIOR' ? 'Senior Citizen' : 'Regular');
    if (currentUser && passengers.length > 0) {
      const match = passengers.find(p => 
        (p.email.toLowerCase() === currentUser.email.toLowerCase() || p.id === currentUser.id) &&
        p.type === targetType
      );
      if (match) return match;
    }

    const categoryMatch = passengers.find(p => p.type === targetType);
    return categoryMatch || passengers[0];
  }, [currentUser, passengers, concessionCategory]);

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
  }, [sourceId, destId, routeMode, activePassenger?.id]);

  const fetchRouteAndFare = async () => {
    setRouteLoading(true);
    setRouteError(null);
    try {
      const rData = await api.findRoute(sourceId, destId, routeMode);
      setRouteData(rData);

      const passengerIdToUse = activePassenger ? activePassenger.id : 1;
      const fData = await api.calculateFare(rData.distance, passengerIdToUse);
      setFareData(fData);
    } catch (err: any) {
      setRouteError(err.message || 'No connected rail path between the selected stations.');
      setRouteData(null);
      setFareData(null);
    } finally {
      setRouteLoading(false);
    }
  };

  // Swap Origin and Destination
  const handleSwapStations = () => {
    const prevSrc = sourceId;
    setSourceId(destId);
    setDestId(prevSrc);
  };

  // Total payable with round-trip multiplier
  const effectiveFare = React.useMemo(() => {
    if (!fareData) return 0;
    const base = fareData.finalFare;
    if (ticketType === 'RJT') {
      // 10% round-trip return discount
      return base * 1.9;
    }
    return base;
  }, [fareData, ticketType]);

  const sourceStation = stations.find(s => s.id === sourceId);
  const destStation = stations.find(s => s.id === destId);
  const selectedTrain = trains.find(t => t.id === selectedTrainId) || eligibleTrains[0];

  // Commuter Smart Card live balance & ID
  const commuterBalance = currentUser?.balance !== undefined 
    ? currentUser.balance 
    : (currentUser?.smartCardBalance !== undefined ? currentUser.smartCardBalance : 450.0);

  const commuterCardId = `MX-88${String(currentUser?.id || 1).padStart(2, '0')}-9912-${String(currentUser?.id || 1).padStart(4, '4410')}`;

  // Triggered when realistic payment gateway completes authentication
  const handlePaymentSuccess = async (paymentDetails: PaymentDetails) => {
    setBookingError(null);
    if (!selectedTrainId) throw new Error('Please select an active metro train.');
    if (!fareData) throw new Error('Valid route and fare calculation required.');

    try {
      const outcome = await api.bookTicket({
        passengerId: activePassenger?.id || 1,
        sourceStationId: sourceId,
        destinationStationId: destId,
        trainId: selectedTrainId,
        paymentMethod: paymentDetails.paymentMethod,
        upiId: paymentDetails.upiId,
        cardNumber: paymentDetails.cardNumber,
        cardHolder: paymentDetails.cardHolder || currentUser?.name || 'Commuter',
        cardExp: paymentDetails.cardExp,
        cardCvv: paymentDetails.cardCvv,
        cashTendered: paymentDetails.cashTendered,
      });

      if (outcome.success) {
        // If paid with Metro Smart Card, deduct ticket fare from card balance
        if (paymentDetails.isSmartCard) {
          const newBal = Math.max(0, parseFloat((commuterBalance - effectiveFare).toFixed(2)));
          if (currentUser?.id) {
            try {
              await api.rechargeSmartCard(currentUser.id, -effectiveFare);
            } catch (cardErr) {
              console.warn('Could not sync card debit to backend:', cardErr);
            }
          }
          if (onBalanceUpdated) {
            onBalanceUpdated(newBal);
          }
        }
        setIsPaymentModalOpen(false);
        setConfirmedBooking(outcome);
        onBookingSuccess();
      } else {
        const msg = outcome.error || outcome.message || 'Booking was not confirmed by Core Engine.';
        setBookingError(msg);
        throw new Error(msg);
      }
    } catch (err: any) {
      setBookingError(err.message || 'Transaction could not be completed.');
      throw err;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#0047BA] uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Official Ticketing Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Book Transit Pass</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Instant contactless QR token issuance, real-time headway dispatch, and secure digital checkout.
          </p>
        </div>

        {/* Live Commuter Identification & Metro Card Pill */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0047BA] border border-blue-200 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left pr-2">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Logged-in Commuter</span>
              <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[150px]">
                {currentUser?.name || 'Authorized Commuter'}
              </span>
              <span className="text-[10px] text-[#0047BA] font-medium truncate block max-w-[150px]">
                {currentUser?.email || 'commuter@metrox.org'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="text-left pr-2">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 block">Metro Card Balance</span>
              <span className="text-sm font-black font-mono text-emerald-700 block leading-tight">
                ₹{commuterBalance.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-600 font-mono">
                {commuterCardId}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Main Booking Configurator */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Ticket Type & Concession Category */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0047BA] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-bold text-sm text-slate-900">Fare Type & Concession Category</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0047BA] border border-blue-200">
                {activePassenger?.discountPercent ? `${activePassenger.discountPercent}% Concession Applied` : 'Standard Fare'}
              </span>
            </div>

            {/* Ticket Journey Type Selector (Single vs Return) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Ticket Pass Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTicketType('SJT')}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    ticketType === 'SJT'
                      ? 'border-[#0047BA] bg-blue-50/60 text-slate-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs block">Single Journey (SJT)</span>
                    <span className="text-[11px] text-slate-500">One-way QR token pass</span>
                  </div>
                  {ticketType === 'SJT' && <div className="w-2 h-2 rounded-full bg-[#0047BA]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setTicketType('RJT')}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    ticketType === 'RJT'
                      ? 'border-[#0047BA] bg-blue-50/60 text-slate-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-xs">Return Journey (RJT)</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">10% OFF</span>
                    </div>
                    <span className="text-[11px] text-slate-500">Same-day round trip</span>
                  </div>
                  {ticketType === 'RJT' && <div className="w-2 h-2 rounded-full bg-[#0047BA]" />}
                </button>
              </div>
            </div>

            {/* Concession Selection Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Commuter Concession Category
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setConcessionCategory('REGULAR')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    concessionCategory === 'REGULAR'
                      ? 'border-[#0047BA] bg-[#0047BA] text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5 mx-auto mb-1 opacity-80" />
                  <span>Standard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConcessionCategory('STUDENT')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    concessionCategory === 'STUDENT'
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 mx-auto mb-1 opacity-80" />
                  <span>Student (20% off)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConcessionCategory('SENIOR');
                    setBookingError(null);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    concessionCategory === 'SENIOR'
                      ? 'border-purple-600 bg-purple-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 mx-auto mb-1 opacity-80" />
                  <span>Senior (30% off)</span>
                </button>
              </div>
            </div>

            {/* DYNAMIC VERIFICATION STEP 1: SENIOR CITIZEN AADHAAR CARD & AGE VERIFICATION */}
            {concessionCategory === 'SENIOR' && (
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-purple-200/60">
                  <div className="flex items-center space-x-2 text-purple-900 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Aadhaar Card Age Verification (UIDAI Transit Gateway)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    Age 60+ Mandatory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Aadhaar Card Number (12-Digit UID)
                    </label>
                    <input
                      type="text"
                      value={aadhaarNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setAadhaarNumber(val.replace(/(\d{4})/g, '$1 ').trim());
                        setAadhaarError(null);
                        setBookingError(null);
                      }}
                      placeholder="5421 8890 1234"
                      maxLength={14}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 font-mono text-slate-900 focus:outline-none focus:border-purple-600 text-xs shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Verified Age as per Aadhaar Card
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min={40}
                        max={115}
                        value={seniorAge}
                        onChange={(e) => {
                          setSeniorAge(Number(e.target.value));
                          setAadhaarError(null);
                          setBookingError(null);
                        }}
                        placeholder="60+"
                        className="w-24 px-3 py-2 rounded-xl bg-white border border-purple-200 font-mono text-slate-900 focus:outline-none focus:border-purple-600 text-xs shadow-2xs font-bold"
                      />
                      <span className={`text-[11px] font-bold px-2.5 py-2 rounded-xl border flex-1 text-center transition ${
                        seniorAge >= 60 && aadhaarNumber.replace(/\D/g, '').length === 12
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {seniorAge >= 60 && aadhaarNumber.replace(/\D/g, '').length === 12
                          ? '✓ Age 60+ Verified'
                          : 'Age 60+ Required'}
                      </span>
                    </div>
                  </div>
                </div>

                {aadhaarError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-1.5 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{aadhaarError}</span>
                  </div>
                )}

                <p className="text-[11px] text-purple-700 leading-tight">
                  30% senior concession is subsidized by Maha Metro Transit for citizens aged 60 and above with verified Indian Aadhaar card credentials.
                </p>
              </div>
            )}

            {/* DYNAMIC VERIFICATION STEP 2: STUDENT INSTITUTIONAL EMAIL VERIFICATION */}
            {concessionCategory === 'STUDENT' && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                    <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Student Institutional Email Verification</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    .edu / .ac.in Domain
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Student Academic Email (.edu / .ac.in)
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => {
                        setStudentEmail(e.target.value);
                        setStudentEmailError(null);
                        setBookingError(null);
                      }}
                      placeholder="student@univ.edu or name@college.ac.in"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-xs shadow-2xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      College / University Institution
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="Institution Name"
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-emerald-200 text-slate-900 focus:outline-none focus:border-emerald-600 text-xs shadow-2xs"
                      />
                      <span className={`text-[11px] font-bold px-2.5 py-2 rounded-xl border text-center transition ${
                        /(\.edu|\.ac|\.college|\.edu\.in|\.ac\.in)/i.test(studentEmail) && studentEmail.includes('@')
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {/(\.edu|\.ac|\.college|\.edu\.in|\.ac\.in)/i.test(studentEmail) && studentEmail.includes('@')
                          ? '✓ Academic Domain'
                          : 'Academic Email Needed'}
                      </span>
                    </div>
                  </div>
                </div>

                {studentEmailError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-1.5 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{studentEmailError}</span>
                  </div>
                )}

                <p className="text-[11px] text-emerald-700 leading-tight">
                  20% student discount applies strictly upon verification of an active educational email address issued by an accredited institution.
                </p>
              </div>
            )}
          </div>

          {/* Card 2: Origin & Destination Stations */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0047BA] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Select Travel Route</h3>
            </div>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Origin Station */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Origin Station (Boarding)</span>
                </label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#0047BA] shadow-xs"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Station Swap Button */}
              <div className="sm:absolute sm:left-1/2 sm:top-[34px] sm:-translate-x-1/2 z-10 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwapStations}
                  className="p-2 rounded-full bg-white border border-slate-300 shadow-sm hover:bg-slate-50 text-[#0047BA] hover:scale-110 active:scale-95 transition"
                  title="Swap Origin and Destination"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* Destination Station */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>Destination Station (Alighting)</span>
                </label>
                <select
                  value={destId}
                  onChange={(e) => setDestId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#0047BA] shadow-xs"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.location})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pathfinding Strategy Selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pathfinding Solver Engine
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRouteMode('dijkstra')}
                  className={`p-3 rounded-xl border text-left transition ${
                    routeMode === 'dijkstra'
                      ? 'border-[#0047BA] bg-blue-50/50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Shortest Track Distance (Dijkstra)</span>
                    {routeMode === 'dijkstra' && <span className="w-2 h-2 rounded-full bg-[#0047BA]" />}
                  </div>
                  <span className="text-[11px] block mt-0.5 text-slate-500">Minimizes rail mileage</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRouteMode('bfs')}
                  className={`p-3 rounded-xl border text-left transition ${
                    routeMode === 'bfs'
                      ? 'border-[#0047BA] bg-blue-50/50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Minimum Stops / Hops (BFS)</span>
                    {routeMode === 'bfs' && <span className="w-2 h-2 rounded-full bg-[#0047BA]" />}
                  </div>
                  <span className="text-[11px] block mt-0.5 text-slate-500">Direct fastest corridor</span>
                </button>
              </div>
            </div>

            {/* Verified Path Visualization */}
            {routeData && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-emerald-700 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Path: {routeData.hops} Stops • {routeData.distance.toFixed(2)} km (~{Math.round(routeData.distance * 1.8)} mins)</span>
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">{routeData.algorithm} Solver</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200">
                  {routeData.pathStations.map((s, idx) => (
                    <React.Fragment key={s.id}>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-xs font-semibold text-slate-900 shadow-2xs">
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

          {/* Card 3: Departing Train Fleet Schedule */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0047BA] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">Next Departing Rakes & Seat Availability</h3>
            </div>

            {eligibleTrains.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                All trains are currently full or in maintenance. Please wait for train turnaround.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {eligibleTrains.map((train, idx) => {
                  const isSelected = selectedTrainId === train.id;
                  const departureMinutes = (idx + 1) * 3;
                  return (
                    <label
                      key={train.id}
                      className={`flex flex-col justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-[#0047BA] bg-blue-50/50 shadow-xs ring-1 ring-[#0047BA]'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="trainSelection"
                            checked={isSelected}
                            onChange={() => setSelectedTrainId(train.id)}
                            className="w-4 h-4 text-[#0047BA] focus:ring-[#0047BA]"
                          />
                          <span className="font-bold text-xs text-slate-900">{train.name}</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          {train.availableCapacity} seats left
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>Platform {train.id % 2 === 0 ? 2 : 1} • In {departureMinutes}m</span>
                        </span>
                        <span className="font-mono text-slate-400">Rake #{train.id}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Fare Breakdown Receipt & Payment Trigger */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6">
            
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0047BA] pb-3 border-b border-slate-100">
              <Calculator className="w-4 h-4" />
              <span>Fare & Journey Receipt</span>
            </div>

            {/* Journey Header */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Route Ticket</span>
              <div className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                <span className="truncate">{sourceStation?.name || 'Origin'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0047BA] shrink-0" />
                <span className="truncate">{destStation?.name || 'Destination'}</span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                {ticketType === 'RJT' ? 'Return Journey Pass (Round-Trip)' : 'Single Journey Pass'} • {selectedTrain?.name || 'Rake'}
              </span>
            </div>

            {/* Fare Breakdown Table */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Base Transit Charge</span>
                <span className="font-mono text-slate-900 font-semibold">₹10.00</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Corridor Mileage (₹3.50/km)</span>
                <span className="font-mono text-slate-900 font-semibold">
                  {fareData ? `${fareData.distance.toFixed(2)} km` : '—'}
                </span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Gross Standard Fare</span>
                <span className="font-mono text-slate-900 font-semibold">
                  ₹{fareData ? fareData.baseFare.toFixed(2) : '—'}
                </span>
              </div>

              {fareData && fareData.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Concession ({concessionCategory})</span>
                  <span className="font-mono">
                    -₹{fareData.discountAmount.toFixed(2)} ({fareData.discountPercent.toFixed(0)}%)
                  </span>
                </div>
              )}

              {ticketType === 'RJT' && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Round-Trip Return Bonus</span>
                  <span className="font-mono">10% Return Off</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Total Payable</span>
                  <span className="text-[10px] text-slate-400">Instant QR ticket included</span>
                </div>
                <span className="text-3xl font-black font-mono text-[#0047BA]">
                  ₹{effectiveFare.toFixed(2)}
                </span>
              </div>
            </div>

            {bookingError && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Real Payment Trigger Button with Verification Guard */}
            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={routeLoading || !fareData || eligibleTrains.length === 0}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0047BA] hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center space-x-2 transition active:scale-98"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Payment (₹{effectiveFare.toFixed(2)})</span>
            </button>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Supports UPI (GPay/PhonePe), Credit/Debit Card & Metro Smart Card.</span>
            </div>

          </div>
        </div>

      </div>

      {/* REALISTIC PAYMENT GATEWAY MODAL */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        fareAmount={effectiveFare}
        originStationName={sourceStation?.name || 'Origin Station'}
        destinationStationName={destStation?.name || 'Destination Station'}
        passengerName={currentUser?.name || 'Alex Morgan'}
        smartCardBalance={commuterBalance}
        smartCardId={commuterCardId}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* CONFIRMED QR BOARDING PASS MODAL */}
      <TicketModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />

    </div>
  );
};
