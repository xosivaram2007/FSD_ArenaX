import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Trophy, CalendarDays, ArrowRight } from 'lucide-react';

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await api.get('/tournaments');
        setTournaments(res.data);
      } catch (error) {
        console.error("Error fetching tournaments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  if (loading) return (
     <div className="flex justify-center items-center h-64">
       <div className="animate-spin rounded-none h-16 w-16 border-t-4 border-b-4 border-red-600 transform rotate-45"></div>
     </div>
  );

  return (
    <div className="space-y-8 animate-slide-in pb-12 mt-4">
      <div className="flex items-end justify-between border-b-4 border-slate-200 dark:border-slate-800 pb-4 mb-8">
        <div>
          <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-1 block">Live Roster</span>
          <h1 className="text-6xl font-display text-slate-900 dark:text-white leading-none uppercase">Official Events</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tournaments.map((tournament) => (
          <Link key={tournament._id} to={`/tournaments/${tournament._id}`} className="block group">
            <div className="glass-card flex flex-col md:flex-row h-full">
              
              {/* Event Date Block (Left Side) */}
              <div className="bg-slate-900 dark:bg-[#0b0f19] md:w-1/3 p-6 flex flex-col justify-center items-center text-center border-r-4 border-red-600 relative overflow-hidden">
                <Trophy className="absolute -left-4 -bottom-4 w-32 h-32 text-white/5 transform group-hover:scale-110 transition-transform" />
                <CalendarDays className="h-8 w-8 text-red-500 mb-3" />
                <span className="text-white font-display text-3xl uppercase leading-none">{new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">
                  {new Date(tournament.startDate).getFullYear()}
                </span>
              </div>
              
              {/* Event Info Block (Right Side) */}
              <div className="p-6 md:w-2/3 flex flex-col justify-between relative bg-white dark:bg-[#121826]">
                <div>
                   <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-widest mb-3 border border-slate-200 dark:border-slate-700">
                     {tournament.sportType}
                   </div>
                   <h2 className="text-3xl font-display text-slate-900 dark:text-white uppercase leading-none mb-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                     {tournament.name}
                   </h2>
                </div>
                
                <div className="mt-8 flex justify-end">
                   <div className="flex items-center text-red-600 font-bold uppercase tracking-wider text-sm group-hover:translate-x-2 transition-transform">
                     Enter Bracket <ArrowRight className="ml-2 w-5 h-5" />
                   </div>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
      
      {tournaments.length === 0 && (
         <div className="glass-panel p-16 text-center border-t-4 border-red-600 mt-8">
           <Trophy className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
           <h3 className="font-display text-4xl text-slate-900 dark:text-white uppercase">No Active Events</h3>
           <p className="mt-2 text-slate-500 font-medium">The stadium is empty. Check back later.</p>
         </div>
      )}
    </div>
  );
};

export default TournamentList;
