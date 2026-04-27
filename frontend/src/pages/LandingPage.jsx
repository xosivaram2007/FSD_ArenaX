import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, CalendarDays, Users, Activity } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center relative">
      {/* Heavy Sports Background Element */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-slate-100 dark:bg-[#121826] -skew-x-12 translate-x-32 -z-10 border-l-[20px] border-red-600 hidden md:block"></div>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column - Hero */}
        <div className="space-y-8 animate-slide-in">
          <div>
            <span className="inline-block px-4 py-1 bg-red-600 text-white font-display text-2xl tracking-widest uppercase mb-4 shadow-lg shadow-red-900/50">
              Official Platform
            </span>
            <h1 className="text-7xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.85] uppercase tracking-tighter drop-shadow-md">
              Dominate <br />
              <span className="text-red-600 dark:text-red-500">The Bracket</span>
            </h1>
            <p className="mt-8 text-lg font-medium text-slate-600 dark:text-slate-400 max-w-md border-l-4 border-slate-300 dark:border-slate-800 pl-4">
              The ultimate infrastructure for tournament organizers and elite competitors. Manage brackets, schedules, and live standings instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
             <Link to="/login" className="sports-skew-btn text-2xl w-full sm:w-auto px-12 py-4 flex items-center justify-center">
               Enter Arena
             </Link>
             <Link to="/tournaments" className="sports-skew-btn !bg-slate-900 dark:!bg-slate-800 text-2xl w-full sm:w-auto px-12 py-4 flex items-center justify-center">
               View Public Live
             </Link>
          </div>
        </div>

        {/* Right Column - Bento Features */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
           
           <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col justify-between group transform transition-all duration-300 hover:border-red-500">
              <Trophy className="h-10 w-10 text-red-600 mb-6 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-display text-4xl text-slate-900 dark:text-white leading-none">Championship<br/>Brackets</h3>
              </div>
           </div>

           <div className="bg-slate-900 dark:bg-[#0b0f19] border border-slate-800 p-8 shadow-sm flex flex-col justify-between group transform transition-all duration-300 hover:border-red-500">
              <Activity className="h-10 w-10 text-white mb-6 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-display text-4xl text-white leading-none">Live<br/>Standings</h3>
              </div>
           </div>

           <div className="bg-[#121826] dark:bg-[#1c2436] border border-slate-800 p-8 shadow-sm flex flex-col justify-between group transform transition-all duration-300 hover:border-red-500 col-span-2 relative overflow-hidden">
              <div className="absolute right-[-20%] bottom-[-50%] opacity-10">
                 <Users className="w-64 h-64 text-white" />
              </div>
              <Users className="h-10 w-10 text-red-500 mb-6 group-hover:scale-110 transition-transform relative z-10" />
              <div className="relative z-10">
                <h3 className="font-display text-4xl text-white leading-none">Complete Roster Management</h3>
                <p className="text-slate-400 mt-2 font-medium">Build teams, manage players, and finalize rosters before the tournament locks.</p>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;
