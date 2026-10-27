import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Building2, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Wifi,
  Clock,
  RefreshCw,
  Zap,
  ExternalLink,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PaymentDetails {
  paymentMethod: 'UPI' | 'Card' | 'Cash';
  isSmartCard?: boolean;
  upiId?: string;
  cardNumber?: string;
  cardHolder?: string;
  cardExp?: string;
  cardCvv?: string;
  cashTendered?: number;
}

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  fareAmount: number;
  originStationName: string;
  destinationStationName: string;
  passengerName: string;
  smartCardBalance?: number;
  smartCardId?: string;
  onPaymentSuccess: (details: PaymentDetails) => Promise<void>;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  fareAmount,
  originStationName,
  destinationStationName,
  passengerName,
  smartCardBalance = 450.0,
  smartCardId = 'MX-9823-1102-4412',
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'smartcard' | 'netbanking'>('upi');
  
  // UPI State
  const [upiMode, setUpiMode] = useState<'qr' | 'vpa'>('qr');
  const [upiId, setUpiId] = useState('commuter@okhdfcbank');
  const [timeLeft, setTimeLeft] = useState(299); // 4:59 countdown timer

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 8920 1144 5566');
  const [cardHolder, setCardHolder] = useState(passengerName || 'Alex Morgan');
  const [cardExp, setCardExp] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('789');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Payment Processing Animation State
  const [processingState, setProcessingState] = useState<'idle' | 'authorizing' | 'securing' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic Real Scannable UPI URL conforming to NPCI specification
  const upiUrl = useMemo(() => {
    const cleanFare = fareAmount.toFixed(2);
    const payee = encodeURIComponent('MetroX Transit Authority');
    const note = encodeURIComponent(`Metro Pass ${originStationName} to ${destinationStationName}`);
    return `upi://pay?pa=metrox.transit@icici&pn=${payee}&mc=4111&am=${cleanFare}&cu=INR&tn=${note}`;
  }, [fareAmount, originStationName, destinationStationName]);

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isQrLoading, setIsQrLoading] = useState<boolean>(true);

  const generateQr = () => {
    setIsQrLoading(true);
    QRCode.toDataURL(upiUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: '#020617',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrCodeDataUrl(url);
        setIsQrLoading(false);
      })
      .catch((err) => {
        console.error('Failed to generate UPI QR:', err);
        setIsQrLoading(false);
      });
  };

  // Timer countdown for UPI QR
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 299));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Reset state and generate real QR when opening
  useEffect(() => {
    if (isOpen) {
      setProcessingState('idle');
      setErrorMessage(null);
      setTimeLeft(299);
      generateQr();
      if (passengerName) {
        setCardHolder(passengerName);
      }
    }
  }, [isOpen, passengerName, upiUrl]);

  const handleRefreshQr = () => {
    setTimeLeft(299);
    generateQr();
  };

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    return raw.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handlePay = async () => {
    setErrorMessage(null);

    // Validate smart card balance if paying via smartcard
    if (activeTab === 'smartcard' && smartCardBalance < fareAmount) {
      setErrorMessage(`Insufficient Smart Card Balance (₹${smartCardBalance.toFixed(2)}). Journey fare is ₹${fareAmount.toFixed(2)}. Please recharge or select UPI / Debit Card.`);
      return;
    }

    setProcessingState('authorizing');

    // Stage 1: Connecting to Payment Gateway (800ms)
    await new Promise((res) => setTimeout(res, 800));
    setProcessingState('securing');

    // Stage 2: 3D Secure / UPI Bank Handshake (1000ms)
    await new Promise((res) => setTimeout(res, 1000));
    setProcessingState('success');

    // Stage 3: Brief success confirmation then dispatch booking
    await new Promise((res) => setTimeout(res, 700));

    try {
      let mappedMethod: 'UPI' | 'Card' | 'Cash' = 'UPI';
      if (activeTab === 'card') mappedMethod = 'Card';
      else if (activeTab === 'smartcard') mappedMethod = 'Card';
      else mappedMethod = 'UPI';

      await onPaymentSuccess({
        paymentMethod: mappedMethod,
        isSmartCard: activeTab === 'smartcard',
        upiId: activeTab === 'upi' ? (upiMode === 'qr' ? 'commuter@gpay' : upiId) : undefined,
        cardNumber: activeTab === 'card' ? cardNumber.replace(/\s/g, '') : (activeTab === 'smartcard' ? smartCardId.replace(/[^0-9]/g, '').padEnd(16, '0') : '9876543210123456'),
        cardHolder: activeTab === 'card' ? cardHolder : passengerName,
        cardExp: activeTab === 'card' ? cardExp : '12/30',
        cardCvv: activeTab === 'card' ? cardCvv : '123',
      });
    } catch (err: any) {
      setProcessingState('idle');
      setErrorMessage(err.message || 'Payment authentication failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Gateway Header */}
        <div className="bg-gradient-to-r from-[#0047BA] via-blue-700 to-indigo-800 text-white p-5 sm:p-6 flex items-center justify-between relative shadow-md">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[11px] font-mono text-blue-200 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TransitPay Secure Gateway • 256-Bit SSL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
              <span>MetroX Payment Portal</span>
            </h2>
            <p className="text-xs text-blue-100">
              {originStationName} <span className="text-blue-300">→</span> {destinationStationName}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-blue-200 uppercase font-mono block">Amount Due</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              ₹{fareAmount.toFixed(2)}
            </div>
            <span className="text-[10px] text-emerald-300 font-medium">Includes Transit Tax</span>
          </div>

          <button
            onClick={onClose}
            disabled={processingState !== 'idle'}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gateway Body: Method Selector & Forms */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Method Selection Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('upi')}
              disabled={processingState !== 'idle'}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                activeTab === 'upi'
                  ? 'bg-white text-[#0047BA] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('card')}
              disabled={processingState !== 'idle'}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                activeTab === 'card'
                  ? 'bg-white text-[#0047BA] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-purple-600" />
              <span>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('smartcard')}
              disabled={processingState !== 'idle'}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                activeTab === 'smartcard'
                  ? 'bg-white text-[#0047BA] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>Smart Card</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('netbanking')}
              disabled={processingState !== 'idle'}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                activeTab === 'netbanking'
                  ? 'bg-white text-[#0047BA] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>NetBanking</span>
            </button>
          </div>

          {/* TAB 1: UPI & DYNAMIC QR CODE */}
          {activeTab === 'upi' && (
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => setUpiMode('qr')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                    upiMode === 'qr' ? 'bg-blue-50 text-[#0047BA] border border-blue-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Dynamic UPI QR Code
                </button>
                <button
                  type="button"
                  onClick={() => setUpiMode('vpa')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                    upiMode === 'vpa' ? 'bg-blue-50 text-[#0047BA] border border-blue-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Enter UPI ID (VPA)
                </button>
              </div>

              {upiMode === 'qr' ? (
                <div className="flex flex-col items-center justify-center p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200 text-center space-y-4">
                  
                  {/* Dynamic High-Res Real Scannable UPI QR Viewfinder */}
                  <div className="relative p-3 bg-white rounded-3xl shadow-lg border border-slate-200/90 group">
                    {/* Corner Camera Targeting Reticles */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#0047BA] rounded-tl-sm pointer-events-none" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#0047BA] rounded-tr-sm pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#0047BA] rounded-bl-sm pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#0047BA] rounded-br-sm pointer-events-none" />

                    <div className="relative w-52 h-52 sm:w-56 sm:h-56 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                      {isQrLoading || !qrCodeDataUrl ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <RefreshCw className="w-6 h-6 animate-spin text-[#0047BA]" />
                          <span className="text-[11px] font-mono text-slate-500">Generating UPI QR...</span>
                        </div>
                      ) : (
                        <>
                          {/* REAL SCANNABLE QR CODE IMAGE */}
                          <img
                            src={qrCodeDataUrl}
                            alt={`UPI QR Code for ₹${fareAmount.toFixed(2)}`}
                            className="w-full h-full object-contain select-none"
                          />

                          {/* Central MetroX Transit Shield Logo Badge */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-9 h-9 rounded-full bg-[#0047BA] border-2 border-white flex items-center justify-center text-white text-[11px] font-black shadow-md">
                              MX
                            </div>
                          </div>

                          {/* Laser Scanning Animation Bar */}
                          {processingState === 'idle' && (
                            <motion.div
                              animate={{ y: [-95, 95, -95] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                              className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_12px_#06B6D4] pointer-events-none"
                            />
                          )}

                          {/* Live Dynamic Scanning Overlay */}
                          <AnimatePresence>
                            {processingState !== 'idle' && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white"
                              >
                                {processingState === 'authorizing' && (
                                  <div className="space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center mx-auto animate-pulse">
                                      <Smartphone className="w-5 h-5 text-blue-300" />
                                    </div>
                                    <p className="text-xs font-bold text-blue-100">UPI App Scan Detected</p>
                                    <p className="text-[10px] text-blue-300 font-mono">Handshaking with NPCI Switch...</p>
                                  </div>
                                )}

                                {processingState === 'securing' && (
                                  <div className="space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center mx-auto">
                                      <Lock className="w-5 h-5 text-amber-300" />
                                    </div>
                                    <p className="text-xs font-bold text-amber-100">Verifying UPI PIN</p>
                                    <p className="text-[10px] text-amber-300 font-mono">Awaiting Bank Approval...</p>
                                  </div>
                                )}

                                {processingState === 'success' && (
                                  <div className="space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center mx-auto">
                                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                                    </div>
                                    <p className="text-xs font-bold text-emerald-100">Payment Received!</p>
                                    <p className="text-[10px] text-emerald-300 font-mono">₹{fareAmount.toFixed(2)} Paid</p>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </div>
                  </div>

                  {/* QR Status & Expiry Bar */}
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full font-mono text-[11px] shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      <span className="font-semibold text-slate-800">Scan & Pay ₹{fareAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Expires in <strong className="text-slate-800">{formattedTime}</strong></span>
                      <button
                        type="button"
                        onClick={handleRefreshQr}
                        className="text-blue-600 hover:text-blue-800 p-0.5 rounded transition"
                        title="Regenerate QR"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Trigger Buttons for Desktop / Mobile */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full max-w-md">
                    <button
                      type="button"
                      onClick={handlePay}
                      disabled={processingState !== 'idle'}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>Simulate Mobile Scan & Pay</span>
                    </button>

                    <a
                      href={upiUrl}
                      className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl transition flex items-center space-x-1"
                      title="Open UPI Intent on Mobile"
                    >
                      <span>Open UPI App</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>

                  {/* Supported UPI Apps Badges */}
                  <div className="pt-1 border-t border-slate-200/80 w-full max-w-sm">
                    <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-2">
                      Compatible with All Official UPI Applications
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'CRED', 'Navi'].map((app) => (
                        <span
                          key={app}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 shadow-2xs"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Virtual Payment Address (VPA / UPI ID)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-[#0047BA] shadow-xs"
                      />
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-2.5 rounded-xl border border-emerald-200 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>VERIFIED</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
                    <div>
                      <span className="font-bold block">Account: Alex Morgan</span>
                      <span className="text-[11px] text-blue-700 font-mono">HDFC Bank • •••• 5566</span>
                    </div>
                    <button
                      type="button"
                      onClick={handlePay}
                      disabled={processingState !== 'idle'}
                      className="px-3.5 py-1.5 bg-[#0047BA] hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition"
                    >
                      Send Request
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    A collect authorization request of <strong>₹{fareAmount.toFixed(2)}</strong> will be sent to your UPI app for 1-click PIN authorization.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE CREDIT / DEBIT / RUPAY CARD */}
          {activeTab === 'card' && (
            <div className="space-y-5">
              {/* Realistic 3D Glassmorphism Virtual Card Preview */}
              <div className="relative w-full max-w-sm mx-auto h-48 rounded-2xl p-5 text-white shadow-xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 border border-white/20 flex flex-col justify-between overflow-hidden">
                {/* Background Holographic Sheen */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black tracking-wider text-cyan-300 uppercase">MetroX Platinum</span>
                    <Wifi className="w-4 h-4 text-slate-300 rotate-90" />
                  </div>
                  <span className="text-xs font-bold tracking-widest text-white/90">RUPAY / VISA</span>
                </div>

                {/* EMV Gold Chip */}
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 shadow-inner flex items-center justify-center relative z-10">
                  <div className="w-7 h-4 border-t border-b border-amber-700/60" />
                </div>

                {/* Live Card Number Display */}
                <div className="relative z-10">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Card Number</span>
                  <div className="text-base sm:text-lg font-mono font-bold tracking-widest text-white drop-shadow-sm">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs relative z-10">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block font-mono">Cardholder</span>
                    <span className="font-bold uppercase tracking-wider">{cardHolder || 'COMMUTER NAME'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 uppercase block font-mono">Valid Thru</span>
                    <span className="font-mono font-bold">{cardExp || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              {/* Card Form Inputs */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    placeholder="4532 0000 0000 0000"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-[#0047BA]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0047BA]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      maxLength={5}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0047BA]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                      maxLength={4}
                      placeholder="•••"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0047BA]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SMART CARD (MAHA METRO CARD TAP & PAY) */}
          {activeTab === 'smartcard' && (
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Wifi className="w-6 h-6 rotate-90" />
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">Maha Metro / MetroX Smart Card</h3>
                <p className="text-xs text-slate-600">Card No: <strong>{smartCardId}</strong> • Active</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 inline-block px-6">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Available Card Balance</span>
                <span className={`text-2xl font-black font-mono ${smartCardBalance < fareAmount ? 'text-rose-600' : 'text-emerald-700'}`}>
                  ₹{smartCardBalance.toFixed(2)}
                </span>
              </div>

              {smartCardBalance < fareAmount ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold max-w-sm mx-auto">
                  ⚠️ Insufficient balance to cover ₹{fareAmount.toFixed(2)}. Please recharge your smart card on Profile or choose UPI / Debit Card above.
                </div>
              ) : (
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Fare of <strong>₹{fareAmount.toFixed(2)}</strong> will be automatically deducted from your Metro Card upon confirmation. Remaining card balance after journey: <strong>₹{(smartCardBalance - fareAmount).toFixed(2)}</strong>.
                </p>
              )}
            </div>
          )}

          {/* TAB 4: NETBANKING */}
          {activeTab === 'netbanking' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Select Issuing Bank</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Bank of Baroda', 'Kotak Bank'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition flex items-center justify-between ${
                      selectedBank === bank
                        ? 'border-[#0047BA] bg-blue-50 text-[#0047BA] shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{bank}</span>
                    {selectedBank === bank && <CheckCircle2 className="w-3.5 h-3.5 text-[#0047BA]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 font-semibold rounded-xl">
              {errorMessage}
            </div>
          )}

        </div>

        {/* Gateway Footer CTA with Live Processing Feedback */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>End-to-End Encrypted Transit Clearance</span>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={processingState !== 'idle'}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePay}
              disabled={processingState !== 'idle'}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-[#0047BA] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {processingState === 'idle' && (
                <>
                  <span>
                    {activeTab === 'upi' ? (upiMode === 'qr' ? 'Simulate Scan & Pay' : 'Verify & Pay') : (activeTab === 'smartcard' ? 'Tap & Pay' : 'Pay')} ₹{fareAmount.toFixed(2)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}

              {processingState === 'authorizing' && (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {activeTab === 'upi' ? 'Connecting to UPI Switch...' : 'Connecting to Bank Gateway...'}
                  </span>
                </>
              )}

              {processingState === 'securing' && (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                  <span>
                    {activeTab === 'upi' ? 'Authorizing UPI PIN (NPCI)...' : '3D Secure Verification...'}
                  </span>
                </>
              )}

              {processingState === 'success' && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {activeTab === 'upi' ? 'UPI Payment Approved!' : 'Payment Approved!'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
