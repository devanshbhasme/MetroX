import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Train as TrainIcon, Shield, LogIn } from 'lucide-react';

export interface StationMilestone {
  id: string;
  label: string;
  short: string;
  tagline: string;
}

const MILESTONES: StationMilestone[] = [
  { id: 'section-hero', label: 'Origin Hub', short: 'STN-01', tagline: 'Welcome & Civic Mission' },
  { id: 'section-about', label: 'About Authority', short: 'STN-02', tagline: 'Metropolitan Network' },
  { id: 'section-pillars', label: 'Founding Pillars', short: 'STN-03', tagline: '4 Core Principles' },
  { id: 'section-architecture', label: 'C++ Architecture', short: 'STN-04', tagline: 'Full-Stack Graph Engine' },
  { id: 'section-services', label: 'Protected Tools', short: 'STN-05', tagline: 'Authenticated Services' },
  { id: 'section-boarding', label: 'Terminus Hub', short: 'STN-06', tagline: 'Boarding & Account Bonus' },
];

interface MetroScrollTrackProps {
  onSignIn?: () => void;
  onAdminSignIn?: () => void;
}

export const MetroScrollTrack: React.FC<MetroScrollTrackProps> = ({
  onSignIn,
  onAdminSignIn,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxTrainRight, setMaxTrainRight] = useState(800);
  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const [isNavbarGone, setIsNavbarGone] = useState(false);

  // Measure track width travel distance dynamically
  useEffect(() => {
    const updateDimensions = () => {
      if (trackRef.current) {
        const trackW = trackRef.current.offsetWidth;
        const trainWidth = 84; // Width of the articulated horizontal train rake
        setMaxTrainRight(Math.max(100, trackW - trainWidth));
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });
    const t1 = setTimeout(updateDimensions, 200);
    const t2 = setTimeout(updateDimensions, 600);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Track whether the page header/navbar has scrolled out of view
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      // Show when user has scrolled past the page header (~75px)
      setIsNavbarGone(scrollY > 75);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Window scroll progress (0.0 to 1.0)
  const { scrollYProgress } = useScroll();

  // Fine-tuned silky-smooth spring physics (zero lag, butter-smooth glide)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.15,
    restDelta: 0.0005,
  });

  // Direct GPU translation: travels RIGHT when scrolling down, LEFT when scrolling up
  const trainX = useTransform(smoothProgress, (val) => val * maxTrainRight);

  // Update active station milestone when crossing thresholds
  useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      const idx = Math.min(
        MILESTONES.length - 1,
        Math.max(0, Math.round(latest * (MILESTONES.length - 1)))
      );
      setActiveStationIndex((prev) => (prev !== idx ? idx : prev));
    });
  }, [smoothProgress]);

  const scrollToStation = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        y: isNavbarGone ? 0 : -110,
        opacity: isNavbarGone ? 1 : 0,
      }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      aria-hidden={!isNavbarGone}
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-md ${
        isNavbarGone ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-2.5 space-y-1.5 select-none text-slate-800">
        
        {/* Top Mini Control Strip */}
        <div className="flex items-center justify-between text-xs">
          
          {/* Left: Branding & Active Station Telemetry in Clean Light Mode */}
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0047BA] to-blue-700 flex items-center justify-center text-white shadow-xs">
              <TrainIcon className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-slate-900 text-xs tracking-tight">
                Metro<span className="text-[#0047BA]">X</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-mono font-bold text-[#0047BA] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                #{MILESTONES[activeStationIndex]?.short}
              </span>
              <span className="text-[11px] font-medium text-slate-600 hidden sm:inline truncate max-w-[200px]">
                {MILESTONES[activeStationIndex]?.label}
              </span>
            </div>
          </div>

          {/* Right: Quick Action Buttons when Navbar is Gone */}
          <div className="flex items-center space-x-2">
            {onAdminSignIn && (
              <button
                onClick={onAdminSignIn}
                className="px-2.5 py-1 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 text-[11px] font-semibold flex items-center space-x-1 transition"
                title="Transit Authority Terminal"
              >
                <Shield className="w-3 h-3 text-purple-600" />
                <span className="hidden md:inline">Authority</span>
              </button>
            )}

            {onSignIn && (
              <button
                onClick={onSignIn}
                className="px-3 py-1 rounded-lg bg-[#0047BA] hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs flex items-center space-x-1 transition"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Metro Rail Bed & Running Train in Light Mode */}
        <div className="relative w-full flex items-center pt-1 pb-1">
          
          {/* Left Origin Catenary Gantry */}
          <div className="shrink-0 flex items-center mr-2">
            <div className="w-1.5 h-6 bg-slate-300 rounded-sm flex flex-col justify-between py-0.5">
              <div className="w-full h-1 bg-[#0047BA] rounded-2xs" />
              <div className="w-full h-1 bg-[#0047BA] rounded-2xs" />
            </div>
          </div>

          {/* Continuous Railway Track */}
          <div ref={trackRef} className="relative flex-1 h-7 flex flex-col justify-center">
            
            {/* Sleeper Cross Ties */}
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(to right, #94A3B8 0px, #94A3B8 2px, transparent 2px, transparent 14px)'
              }}
            />

            {/* Top Steel Rail Line */}
            <div className="w-full h-[2.5px] bg-slate-300 rounded-full relative overflow-hidden mb-1.5 shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#0047BA] via-blue-500 to-teal-400 rounded-full origin-left will-change-transform shadow-[0_0_6px_rgba(0,71,186,0.5)]"
                style={{ scaleX: smoothProgress }}
              />
            </div>

            {/* Bottom Steel Rail Line */}
            <div className="w-full h-[2.5px] bg-slate-300 rounded-full relative overflow-hidden shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#0047BA] via-blue-500 to-teal-400 rounded-full origin-left will-change-transform shadow-[0_0_6px_rgba(0,71,186,0.5)]"
                style={{ scaleX: smoothProgress }}
              />
            </div>

            {/* Station Stops Distributed Horizontally Across the Line */}
            {MILESTONES.map((stn, idx) => {
              const fraction = idx / (MILESTONES.length - 1);
              const isPassed = idx <= activeStationIndex;

              return (
                <div 
                  key={stn.id} 
                  style={{ left: `${fraction * 100}%` }} 
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <button
                    onClick={() => scrollToStation(stn.id)}
                    className="group relative flex items-center justify-center focus:outline-hidden"
                    title={`Jump to ${stn.label}: ${stn.tagline}`}
                  >
                    {/* Station Stop Node Ring */}
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isPassed 
                        ? 'bg-[#0047BA] border-blue-400 ring-2 ring-blue-200 scale-110 shadow-xs' 
                        : 'bg-white border-slate-300 group-hover:border-[#0047BA] group-hover:scale-105 shadow-2xs'
                    }`}>
                      <div className={`w-1 h-1 rounded-full transition-colors ${
                        isPassed ? 'bg-white' : 'bg-slate-400 group-hover:bg-[#0047BA]'
                      }`} />
                    </div>

                    {/* Milestone Popover on Hover / Active */}
                    <div className={`absolute top-5 whitespace-nowrap px-2 py-0.5 rounded-md text-[9px] font-bold border shadow-md transition-all ${
                      idx === activeStationIndex
                        ? 'bg-white text-[#0047BA] border-blue-300 opacity-100 scale-100'
                        : 'bg-white/95 text-slate-600 border-slate-200 opacity-0 group-hover:opacity-100 group-hover:scale-100 pointer-events-none'
                    }`}>
                      <span>#{stn.short}</span>
                      <span className="hidden sm:inline ml-1 text-slate-700 font-medium">{stn.label}</span>
                    </div>
                  </button>
                </div>
              );
            })}

            {/* RUNNING METRO TRAIN RAKE (Moves RIGHT on scroll down, LEFT on scroll up) */}
            <motion.div
              style={{ x: trainX }}
              className="absolute top-1/2 -translate-y-1/2 left-0 z-20 cursor-grab active:cursor-grabbing will-change-transform"
            >
              {/* Articulated 2-Car Metro Rake in Clean Pearl White & Nagpur Livery */}
              <div className="relative flex items-center group">
                
                {/* 1. TRAILING PASSENGER CAR (Coach 102) */}
                <div className="relative w-[36px] h-[22px] bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-l-md border border-slate-300 shadow-sm flex flex-col justify-between p-0.5 overflow-hidden">
                  {/* Roof HVAC & Pantograph Linkage */}
                  <div className="w-full flex items-center justify-between px-1">
                    <div className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
                    <div className="w-1.5 h-0.5 bg-amber-500 rounded-full animate-pulse" />
                  </div>
                  {/* Orange & Aqua Livery Stripe */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-cyan-500" />
                  {/* Tinted Passenger Square Windows */}
                  <div className="flex items-center justify-around px-0.5">
                    <div className="w-2 h-2 rounded-2xs bg-slate-800 border border-slate-600 shadow-inner" />
                    <div className="w-2 h-2 rounded-2xs bg-slate-800 border border-slate-600 shadow-inner" />
                    <div className="w-2 h-2 rounded-2xs bg-slate-800 border border-slate-600 shadow-inner" />
                  </div>
                  {/* Underbody Bogie Wheels */}
                  <div className="flex justify-between px-1 -mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 border border-slate-400 shadow-xs" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 border border-slate-400 shadow-xs" />
                  </div>
                </div>

                {/* 2. ARTICULATED GANGWAY ACCORDION BELLOWS */}
                <div className="w-1.5 h-[18px] bg-slate-800 flex flex-col justify-between py-0.5 border-y border-slate-500">
                  <div className="w-full h-0.5 bg-slate-400" />
                  <div className="w-full h-0.5 bg-slate-400" />
                  <div className="w-full h-0.5 bg-slate-400" />
                </div>

                {/* 3. LEADING MOTOR DRIVING CAR (Coach 101 - Aerodynamic Cab) */}
                <div className="relative w-[44px] h-[22px] bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-r-xl border border-slate-300 shadow-md flex flex-col justify-between p-0.5 overflow-hidden">
                  {/* Roofline */}
                  <div className="w-full flex items-center justify-between px-1">
                    <span className="text-[6px] font-mono font-black text-[#0047BA]">R-101</span>
                    <div className="w-3 h-0.5 bg-slate-400 rounded-full" />
                  </div>
                  {/* Orange & Aqua Livery Stripe */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-cyan-500" />
                  {/* Windows & Slanted Windshield */}
                  <div className="flex items-center justify-between px-0.5">
                    <div className="w-2 h-2 rounded-2xs bg-slate-800 border border-slate-600 shadow-inner" />
                    {/* Curved Forward Windshield (Facing Right) */}
                    <div className="w-4 h-2.5 rounded-r-md bg-gradient-to-r from-sky-900 to-slate-900 border border-slate-500 shadow-inner flex items-center justify-end pr-0.5">
                      <div className="w-1 h-1 rounded-full bg-cyan-300/60" />
                    </div>
                  </div>
                  {/* Underbody Wheels */}
                  <div className="flex justify-between px-1 -mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 border border-slate-400 shadow-xs" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 border border-slate-400 shadow-xs" />
                  </div>
                </div>

                {/* 4. TWIN FORWARD PROJECTOR HEADLIGHTS & VOLUMETRIC BEAM */}
                <div className="flex flex-col justify-between h-3.5 pl-0.5 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-white shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-white shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />
                  {/* Forward Headlight Beam Cone Casting Right */}
                  <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-400/20 blur-xs rounded-r-full pointer-events-none" />
                </div>

                {/* Live Status Tooltip in Light Mode */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-slate-800 text-[8px] font-bold px-2 py-0.5 rounded shadow-md border border-slate-200 whitespace-nowrap flex items-center space-x-1 pointer-events-none">
                  <TrainIcon className="w-2.5 h-2.5 text-[#0047BA] shrink-0" />
                  <span className="text-[#0047BA] font-mono">Nagpur MetroX Rake 101</span>
                </div>

              </div>
            </motion.div>

          </div>

          {/* Right Terminus Hydraulic Buffer Stop */}
          <div className="shrink-0 flex items-center ml-2">
            <div className="w-2 h-6 bg-slate-200 rounded-sm border border-slate-300 flex flex-col items-center justify-center">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-2xs" />
            </div>
          </div>

        </div>

      </div>
    </motion.aside>
  );
};
