import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Lock, LogIn, ArrowRight, Shield, Zap, Sparkles, ChevronDown, Cpu, Gauge, Compass } from 'lucide-react';

import imgOne from '../assets/metro/one.png';
import imgTwo from '../assets/metro/two.png';
import imgThree from '../assets/metro/three.png';
import imgFour from '../assets/metro/four.png';

interface HeroTrainExperienceProps {
  onSignIn?: () => void;
  onAdminSignIn?: () => void;
}

export const HeroTrainExperience: React.FC<HeroTrainExperienceProps> = ({
  onSignIn,
  onAdminSignIn,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload all 4 photographic sequence frames for instantaneous zero-flicker rendering
  useEffect(() => {
    [imgOne, imgTwo, imgThree, imgFour].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Measure scroll progress through the 380vh runway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Butter-smooth spring physics for immediate, tactile responsiveness (120 FPS GPU glide)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.18,
    restDelta: 0.0005,
  });

  // -------------------------------------------------------------
  // STAGE 1: one.png (Scroll 0.00 -> 0.28)
  // -------------------------------------------------------------
  const oneOpacity = useTransform(smoothProgress, [0, 0.22, 0.30], [1, 1, 0]);
  const oneScale = useTransform(smoothProgress, [0, 0.28], [1.0, 1.12]);
  const oneTextOpacity = useTransform(smoothProgress, [0, 0.20], [1, 0]);
  const oneTextY = useTransform(smoothProgress, [0, 0.20], [0, -30]);

  // -------------------------------------------------------------
  // STAGE 2: two.png (Scroll 0.22 -> 0.54)
  // -------------------------------------------------------------
  const twoOpacity = useTransform(smoothProgress, [0.22, 0.30, 0.48, 0.56], [0, 1, 1, 0]);
  const twoScale = useTransform(smoothProgress, [0.22, 0.38, 0.56], [0.94, 1.0, 1.12]);

  // -------------------------------------------------------------
  // STAGE 3: three.png (Scroll 0.48 -> 0.76)
  // -------------------------------------------------------------
  const threeOpacity = useTransform(smoothProgress, [0.48, 0.56, 0.72, 0.80], [0, 1, 1, 0]);
  const threeScale = useTransform(smoothProgress, [0.48, 0.62, 0.80], [0.94, 1.0, 1.12]);

  // -------------------------------------------------------------
  // STAGE 4: four.png & Interior Telemetry Reveals (Scroll 0.72 -> 1.00)
  // -------------------------------------------------------------
  const fourOpacity = useTransform(smoothProgress, [0.72, 0.80, 1.0], [0, 1, 1]);
  const fourScale = useTransform(smoothProgress, [0.72, 0.86, 1.0], [0.95, 1.0, 1.04]);

  // Sequential reveal of each station telemetry card on stage 4
  const card1Opacity = useTransform(smoothProgress, [0.80, 0.85], [0, 1]);
  const card1Y = useTransform(smoothProgress, [0.80, 0.85], [25, 0]);

  const card2Opacity = useTransform(smoothProgress, [0.84, 0.89], [0, 1]);
  const card2Y = useTransform(smoothProgress, [0.84, 0.89], [25, 0]);

  const card3Opacity = useTransform(smoothProgress, [0.88, 0.93], [0, 1]);
  const card3Y = useTransform(smoothProgress, [0.88, 0.93], [25, 0]);

  const card4Opacity = useTransform(smoothProgress, [0.92, 0.97], [0, 1]);
  const card4Y = useTransform(smoothProgress, [0.92, 0.97], [25, 0]);

  // Final Action Gate inside Stage 4
  const cabinActionsOpacity = useTransform(smoothProgress, [0.94, 0.99], [0, 1]);
  const cabinActionsY = useTransform(smoothProgress, [0.94, 0.99], [20, 0]);



  return (
    <div 
      id="section-hero"
      ref={containerRef} 
      className="relative h-[380vh] w-full"
    >
      {/* Pinned Sticky Viewport Canvas in Light Mode */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-3 sm:px-6">
        
        {/* Soft Ambient Sky Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/70 via-slate-50 to-blue-50/40 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Top HUD Telemetry Pill */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md text-xs font-mono text-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
          <span className="font-bold text-[#0047BA]">NAGPUR METROX RAKE 101</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">REAL PHOTOREALISTIC SEQUENCE</span>
        </div>

        {/* 3D PERSPECTIVE STAGE CONTAINER */}
        <div 
          className="relative w-full max-w-5xl h-[590px] sm:h-[650px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,71,186,0.18)] bg-slate-900 flex items-center justify-center"
        >

          {/* ========================================================================= */}
          {/* FRAME 1: one.png                                                          */}
          {/* ========================================================================= */}
          <motion.div
            style={{
              opacity: oneOpacity,
              scale: oneScale,
            }}
            className="absolute inset-0 will-change-transform z-10 overflow-hidden"
          >
            <img 
              src={imgOne} 
              alt="Nagpur Metro Sequence 1" 
              className="w-full h-full object-cover object-center filter brightness-[1.02]"
            />
            {/* Soft Ambient Gradient to ensure headline legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-slate-950/40 pointer-events-none" />

            {/* Stage 1 Headline Overlay */}
            <motion.div 
              style={{ opacity: oneTextOpacity, y: oneTextY }}
              className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-between text-center z-20"
            >
              <div className="space-y-4 max-w-3xl mx-auto my-auto">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs text-blue-100 shadow-md">
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-semibold">Sign in required to access live transit system & booking engine</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-lg">
                  Rapid Transit for an <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-emerald-300 bg-clip-text text-transparent">
                    Interconnected Tomorrow
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal max-w-2xl mx-auto drop-shadow-md">
                  MetroX is Nagpur’s next-generation rapid transit network, driven by high-performance algorithmic route engines, zero-emission electric rakes, and barrier-free civic transit.
                </p>
              </div>

              {/* Scroll Down Hint */}
              <div className="flex flex-col items-center justify-center space-y-1 text-slate-200 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-200 font-bold flex items-center space-x-1.5 drop-shadow-sm">
                  <span>Scroll down to reveal full train sequence</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ChevronDown className="w-4 h-4 text-cyan-300" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>


          {/* ========================================================================= */}
          {/* FRAME 2: two.png                                                          */}
          {/* ========================================================================= */}
          <motion.div
            style={{
              opacity: twoOpacity,
              scale: twoScale,
            }}
            className="absolute inset-0 will-change-transform z-20 overflow-hidden pointer-events-none"
          >
            <img 
              src={imgTwo} 
              alt="Nagpur Metro Sequence 2" 
              className="w-full h-full object-cover object-center filter brightness-[1.02]"
            />
            {/* Subtle Gradient Framing */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/30" />

            {/* Telemetry Badge (Bottom Left) */}
            <div className="absolute bottom-6 left-6 px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs font-mono shadow-lg flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-bold">FRAME 2 • VIADUCT APPROACH</span>
            </div>
          </motion.div>


          {/* ========================================================================= */}
          {/* FRAME 3: three.png                                                        */}
          {/* ========================================================================= */}
          <motion.div
            style={{
              opacity: threeOpacity,
              scale: threeScale,
            }}
            className="absolute inset-0 will-change-transform z-30 overflow-hidden pointer-events-none"
          >
            <img 
              src={imgThree} 
              alt="Nagpur Metro Sequence 3" 
              className="w-full h-full object-cover object-center filter brightness-[1.02]"
            />
            {/* Subtle Gradient Framing */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30" />

            {/* Telemetry Badge (Bottom Left) */}
            <div className="absolute bottom-6 left-6 px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs font-mono shadow-lg flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">FRAME 3 • PASSENGER SALOON</span>
            </div>
          </motion.div>


          {/* ========================================================================= */}
          {/* FRAME 4: four.png & Interior Telemetry Cards                              */}
          {/* ========================================================================= */}
          <motion.div
            style={{
              opacity: fourOpacity,
              scale: fourScale,
            }}
            className="absolute inset-0 will-change-transform z-40 overflow-hidden flex flex-col justify-between p-4 sm:p-7"
          >
            <img 
              src={imgFour} 
              alt="Nagpur Metro Sequence 4" 
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98] -z-10"
            />
            {/* Backdrop Sheen for Telemetry Card Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/35 to-slate-950/75 pointer-events-none -z-10" />

            {/* Cabin Header HUD in Light Glass Style */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/20 pb-2.5 gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
                <div>
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-widest block leading-none">
                    Passenger Deck • Rake 101 Saloon
                  </span>
                  <span className="text-[10px] font-mono text-slate-300">
                    Next Stop: Sitabuldi Interchange • Speed: 80 km/h • Traction: AC Electric
                  </span>
                </div>
              </div>

              {/* Dynamic Station Route Strip */}
              <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-mono text-white shadow-xs">
                <span className="text-slate-400 font-semibold">ROUTE:</span>
                <span className="text-cyan-300 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>SITABULDI</span>
                </span>
                <span className="text-slate-400">→</span>
                <span className="text-slate-300">AIRPORT</span>
                <span className="text-slate-400">→</span>
                <span className="text-slate-300">KHAPRI</span>
              </div>
            </div>

            {/* THE FOUR REVEALED PASSENGER INFORMATION DISPLAY (PIDS) CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-auto">
              
              {/* Card 1: Network & Corridors */}
              <motion.div
                style={{ opacity: card1Opacity, y: card1Y }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-blue-200/90 shadow-xl relative overflow-hidden group hover:border-[#0047BA] hover:shadow-2xl transition"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-3xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100/90 border border-blue-200 flex items-center justify-center text-[#0047BA] shadow-xs">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-blue-50 text-[#0047BA] border border-blue-200">
                    TELEMETRY 01
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#0047BA] uppercase tracking-wider block">Station 1: Network</span>
                <span className="text-lg font-black text-slate-900">Orange & Aqua</span>
                <p className="text-xs text-slate-600 mt-1">Sitabuldi Interchange bi-directional hub connecting 38 km of track.</p>
              </motion.div>

              {/* Card 2: Eco Traction */}
              <motion.div
                style={{ opacity: card2Opacity, y: card2Y }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-emerald-200/90 shadow-xl relative overflow-hidden group hover:border-emerald-600 hover:shadow-2xl transition"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-3xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100/90 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    TELEMETRY 02
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Station 2: Traction</span>
                <span className="text-lg font-black text-slate-900">100% Electric</span>
                <p className="text-xs text-slate-600 mt-1">Zero tailpipe emissions with regenerative braking returning 32% grid energy.</p>
              </motion.div>

              {/* Card 3: Core C++ Engine */}
              <motion.div
                style={{ opacity: card3Opacity, y: card3Y }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-amber-200/90 shadow-xl relative overflow-hidden group hover:border-amber-500 hover:shadow-2xl transition"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-3xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/90 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    TELEMETRY 03
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Station 3: Graph Engine</span>
                <span className="text-lg font-black text-slate-900">C++ Native</span>
                <p className="text-xs text-slate-600 mt-1">Dijkstra shortest-path & BFS minimum interchange solver in sub-2ms.</p>
              </motion.div>

              {/* Card 4: Punctuality */}
              <motion.div
                style={{ opacity: card4Opacity, y: card4Y }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-purple-200/90 shadow-xl relative overflow-hidden group hover:border-purple-600 hover:shadow-2xl transition"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-bl-3xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100/90 border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    TELEMETRY 04
                  </span>
                </div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Station 4: Headway</span>
                <span className="text-lg font-black text-slate-900">99.8% On-Time</span>
                <p className="text-xs text-slate-600 mt-1">Automated electronic interlocking & precise real-time signal dispatch.</p>
              </motion.div>

            </div>

            {/* CABIN ACTION PORTAL */}
            <motion.div 
              style={{ opacity: cabinActionsOpacity, y: cabinActionsY }}
              className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/20"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white/90 font-medium drop-shadow-sm">Ready to enter passenger deck & book your trip?</span>
              </div>

              <div className="flex items-center space-x-2.5">
                {onAdminSignIn && (
                  <button
                    onClick={onAdminSignIn}
                    className="px-4 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-400/50 text-xs font-semibold flex items-center space-x-1.5 transition shadow-md"
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-300" />
                    <span>Authority Terminal</span>
                  </button>
                )}

                {onSignIn && (
                  <button
                    onClick={onSignIn}
                    className="px-5 py-2 rounded-xl bg-[#0047BA] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-900/50 flex items-center space-x-1.5 transition"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In to Book Rake</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>

          </motion.div>

        </div>

        {/* Bottom Horizontal Runway Progress Tracker */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-1.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#0047BA] via-blue-500 to-teal-500 rounded-full origin-left will-change-transform"
            style={{ scaleX: smoothProgress }}
          />
        </div>

      </div>
    </div>
  );
};
