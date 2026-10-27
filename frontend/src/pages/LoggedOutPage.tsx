import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  ShieldCheck, 
  Leaf, 
  Users, 
  Award, 
  Zap, 
  ArrowRight, 
  LogIn, 
  HeartHandshake, 
  Sparkles, 
  Globe, 
  Target,
  Clock,
  Cpu,
  Layers,
  Shield,
  Lock,
  Train as TrainIcon
} from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';
import { MetroScrollTrack } from '../components/MetroScrollTrack';

interface LoggedOutPageProps {
  onSignIn: () => void;
  onAdminSignIn: () => void;
}

export const LoggedOutPage: React.FC<LoggedOutPageProps> = ({
  onSignIn,
  onAdminSignIn
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6 pb-12"
    >
      {/* Real-Time Animated Metro Rail Track at Top (Appears after navbar scrolls out of view) */}
      <MetroScrollTrack onSignIn={onSignIn} onAdminSignIn={onAdminSignIn} />
      
      {/* 1. STANDALONE CIVIC TOP BAR */}
      <header className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl px-5 py-3.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0047BA] to-blue-700 flex items-center justify-center text-white shadow-xs">
            <TrainIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                Metro<span className="text-[#0047BA]">X</span>
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full border bg-blue-50 text-[#0047BA] border-blue-200">
                Civic Portal
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
              Smart Transit Authority • Public Mission Overview
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onAdminSignIn}
            className="px-3 py-1.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Transit Authority Terminal Clearance"
          >
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Authority Terminal</span>
          </button>

          <button
            onClick={onSignIn}
            className="px-4 py-1.5 rounded-xl bg-[#0047BA] hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTENT STREAM */}
      <div className="w-full space-y-14">
          
          {/* HERO MISSION BANNER */}
          <section id="section-hero" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white shadow-2xl border border-slate-800 scroll-mt-20">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative px-6 py-12 sm:px-12 sm:py-16 max-w-5xl mx-auto text-center space-y-8">
              
              {/* Security Notice Pill */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-200 shadow-sm animate-in fade-in duration-300">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-semibold">Sign in required to access live transit system & booking engine</span>
              </div>

              {/* Main Title & Subtitle */}
              <div className="space-y-4 max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  Rapid Transit for an <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                    Interconnected Tomorrow
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  MetroX is Nagpur’s next-generation rapid transit network, driven by high-performance algorithmic route engines, zero-emission electric rakes, and barrier-free civic transit.
                </p>
              </div>

              {/* Core Action CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={onSignIn}
                  className="px-6 py-3.5 rounded-xl bg-[#0047BA] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-900/40 hover:shadow-blue-700/50 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onAdminSignIn}
                  className="px-5 py-3.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-200 font-semibold text-sm border border-purple-500/30 backdrop-blur-md transition-all flex items-center space-x-2"
                  title="Official Transit Authority Access"
                >
                  <Shield className="w-4 h-4 text-purple-300" />
                  <span>Transit Authority Login</span>
                </button>
              </div>

              {/* Quick Metric Ribbon */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-left">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">Corridors</span>
                  <span className="text-xl font-black text-white">Orange & Aqua</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Sitabuldi Interchange Hub</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">Eco Traction</span>
                  <span className="text-xl font-black text-white">100% Electric</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Zero direct corridor emissions</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">Core Engine</span>
                  <span className="text-xl font-black text-white">C++ Powered</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Dijkstra & BFS pathfinders</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">Punctuality</span>
                  <span className="text-xl font-black text-white">99.8% Headway</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Automated signal control</p>
                </div>
              </div>

            </div>
          </section>

          {/* ABOUT METROX: CIVIC MISSION & ORIGIN */}
          <section id="section-about" className="space-y-8 scroll-mt-20">
            <ScrollReveal>
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0047BA] text-xs font-bold border border-blue-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>About MetroX Transit Authority</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Engineering Urban Mobility for Millions
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Founded to decongest growing metropolitan arterial corridors, MetroX combines classical algorithmic rigor with modern digital ticketing, making high-speed mass transit accessible, affordable, and sustainable.
                </p>
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047BA] flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Civic Connectivity</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Linking central transit nodes like Sitabuldi, Railway Station, Airport, and educational hubs through a seamless bi-directional corridor network.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Clean Energy Mobility</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Replacing thousands of internal-combustion daily vehicular trips with solar-augmented regenerative braking trains, preventing over 45 metric tons of CO₂ daily.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Algorithmic Precision</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our bespoke C++ transit engine computes multi-line graph traversals in under 2 milliseconds, guaranteeing commuters the absolute shortest route and optimal interchange points.
                </p>
              </div>
            </StaggerContainer>
          </section>

          {/* OUR CORE PURPOSE & PILLARS */}
          <section id="section-pillars" className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden space-y-8 scroll-mt-20">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Target className="w-3.5 h-3.5" />
                <span>Our Founding Purpose</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                The Four Pillars Guiding MetroX
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every track segment, ticketing algorithm, and station facility is built with purpose. We are dedicated to delivering equitable, safe, and transparent transit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Pillar 1 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 hover:bg-white/10 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">1. Environmental Stewardship</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Reducing metropolitan road congestion and fuel consumption by providing rapid, electric alternatives with carbon offset reporting for every ticket booked.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 hover:bg-white/10 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">2. Equitable Access for All</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Standardized 20% concessions for students, 30% for senior citizens, and 100% barrier-free stations with audio-tactile cues, ramps, and dedicated lifts.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 hover:bg-white/10 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">3. Punctuality & Safety First</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Continuous monitoring of train rakes, automated track signaling, proactive maintenance advisories, and certified fleet capacity tracking.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 hover:bg-white/10 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">4. Digital-First Ease</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fast, paperless digital passes, transparent fare slabs, instant smart card reloads, and verifiable automated refund calculations.
                </p>
              </div>

            </div>
          </section>

          {/* TECHNICAL EXCELLENCE & ARCHITECTURE */}
          <section id="section-architecture" className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0047BA]">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Full-Stack Transit System Architecture</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">How MetroX Works Under the Hood</h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 self-start sm:self-auto">
                Zero External Dependencies • C++ & React
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0047BA]">Layer 1: Core Engine</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">C++ Native</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">Graph Algorithms & Rakes</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Dijkstra shortest path search</li>
                  <li>BFS minimum interchange solver</li>
                  <li>Bilateral track connectivity matrices</li>
                  <li>Flat-file data durability (`data/*.txt`)</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-700">Layer 2: Gateway</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">Node.js Express</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">REST API & Auth Vault</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>PBKDF2 salted hash authentication</li>
                  <li>Dynamic fare calculation API</li>
                  <li>Automated synchronization with C++ state</li>
                  <li>Ticket lifecycle state machine</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-purple-700">Layer 3: Experience</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">React & Vite</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">Commuter & Admin Portals</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>High-contrast interactive network map</li>
                  <li>Smart card stored value recharge</li>
                  <li>Real-time alert board & maintenance feed</li>
                  <li>Accessible, responsive UI with zero clutter</li>
                </ul>
              </div>

            </div>
          </section>

          {/* PROTECTED TRANSIT SERVICES (LOCKED UNTIL USER SIGNS IN) */}
          <section id="section-services" className="space-y-6 scroll-mt-20">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                <Lock className="w-3 h-3 text-amber-500" />
                <span>Protected Transit Operations</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">System Access Restricted to Authenticated Commuters</h3>
              <p className="text-xs text-slate-500 max-w-xl mx-auto">
                To ensure corridor security, passenger capacity integrity, and personalized concession rates, all transit tools require an active session.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div 
                onClick={onSignIn}
                className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0047BA] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Locked</span>
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#0047BA] transition-colors flex items-center justify-between">
                    <span>Interactive Metro Map</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0047BA] group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Sign in to view live corridor telemetry, station interchanges, and rake occupancy.
                  </p>
                </div>
              </div>

              <div 
                onClick={onSignIn}
                className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Locked</span>
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                    <span>Fare & Concessions</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Sign in to calculate stage fares, apply 20% student or 30% senior citizen discounts.
                  </p>
                </div>
              </div>

              <div 
                onClick={onSignIn}
                className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Locked</span>
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors flex items-center justify-between">
                    <span>Train Timetables</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Sign in to check live corridor headway, platform allocations, and service advisories.
                  </p>
                </div>
              </div>

              <div 
                onClick={onSignIn}
                className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#0047BA] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0047BA] border border-blue-200">
                    Unlock Now
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0047BA] flex items-center justify-between">
                    <span>Sign In or Register</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0047BA] group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Log in to book QR tickets, view history, top up SmartCard, and access full portal.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* CIVIC CHARTER & TRUST GUARANTEE */}
          <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Maha Metro Aligned Safety Compliance</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>100% Zero Direct Emissions</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <HeartHandshake className="w-4 h-4 text-blue-600" />
                <span>Inclusive Civic Transit Guarantee</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>ISO 9001:2015 Quality Standards</span>
              </span>
            </div>
          </section>

          {/* BOTTOM CALL TO ACTION */}
          <section id="section-boarding" className="rounded-3xl bg-gradient-to-r from-[#0047BA] to-blue-800 p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 scroll-mt-20">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold">Ready to Board the MetroX Network?</h3>
              <p className="text-xs sm:text-sm text-blue-100">
                Create your account today and receive a ₹100 welcome bonus on your digital SmartCard.
              </p>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={onSignIn}
                className="px-6 py-3 rounded-xl bg-white text-[#0047BA] font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition"
              >
                Sign In / Register
              </button>
              <button
                onClick={onAdminSignIn}
                className="px-5 py-3 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm border border-blue-400/30 transition flex items-center space-x-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Authority Terminal</span>
              </button>
            </div>
          </section>

        </div>

    </motion.div>
  );
};
