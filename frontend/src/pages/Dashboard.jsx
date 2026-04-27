import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Trophy, Users, Calendar, BarChart, Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    tournaments: [],
    loading: true
  });

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await api.get('/tournaments');
        setStats({ tournaments: res.data, loading: false });
      } catch (error) {
        setStats({ tournaments: [], loading: false });
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="glass-panel rounded-2xl p-8 flex flex-col sm:flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 dark:opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/4">
           <Trophy className="w-64 h-64 text-indigo-500" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Welcome back, <span className="premium-gradient-text">{user.name}</span>!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Here's your sports management overview</p>
        </div>
        {user.role === 'Admin' && (
          <div className="mt-6 sm:mt-0 relative z-10">
            <Link 
              to="/tournaments/new" 
              className="premium-gradient-bg text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center hover:scale-105 transition-transform"
            >
              <Plus className="h-5 w-5 mr-1" /> Create Tournament
            </Link>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-start space-x-4">
          <div className="premium-gradient-bg p-4 rounded-xl text-white shadow-md">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Events</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stats.tournaments.length}</p>
          </div>
        </div>
        
        <div className="glass-card p-6 flex items-start space-x-4">
           <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-xl text-white shadow-md">
             <Calendar className="h-6 w-6" />
           </div>
           <div>
             <p className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Access Level</p>
             <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">{user.role}</p>
           </div>
        </div>

        {user.role === 'Admin' && (
          <div className="glass-card p-6 flex items-start space-x-4">
             <div className="bg-red-600 p-4 rounded-xl text-white shadow-md">
               <Users className="h-6 w-6" />
             </div>
             <div>
               <p className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Personnel</p>
               <Link to="/admin/users" className="text-xl font-bold text-red-600 dark:text-red-400 mt-2 block hover:underline">Manage DB &rarr;</Link>
             </div>
          </div>
        )}
      </div>

      <div className="glass-panel border-0 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Recent Tournaments</h2>
          <Link to="/tournaments" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-bold flex items-center">View All &rarr;</Link>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-800/50 relative">
          {stats.loading ? (
             <div className="p-12 text-center text-gray-500 dark:text-gray-400">Loading tournaments...</div>
          ) : stats.tournaments.length === 0 ? (
             <div className="p-12 text-center text-gray-500 dark:text-gray-400">No tournaments available.</div>
          ) : (
             stats.tournaments.slice(0, 4).map(tournament => (
               <Link 
                  key={tournament._id} 
                  to={`/tournaments/${tournament._id}`}
                  className="p-6 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 flex flex-col sm:flex-row justify-between items-center transition-colors block group"
                >
                  <div className="flex items-center space-x-5 mb-4 sm:mb-0">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-full text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tournament.name}</h3>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">{tournament.sportType}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                    {new Date(tournament.startDate).toLocaleDateString()}
                  </div>
               </Link>
             ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
