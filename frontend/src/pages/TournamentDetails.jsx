import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Trophy, Users, Calendar, Award, UserPlus, Trash2 } from 'lucide-react';

const TournamentDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, teams, matches, standings

  const fetchData = async () => {
    try {
      const [tRes, teamsRes, mRes, sRes] = await Promise.all([
        api.get(`/tournaments/${id}`),
        api.get(`/teams/tournament/${id}`),
        api.get(`/matches/tournament/${id}`),
        api.get(`/standings/tournament/${id}`)
      ]);
      setTournament(tRes.data);
      setTeams(teamsRes.data);
      setMatches(mRes.data);
      setStandings(sRes.data);
      if (user && user.role === 'Admin') {
         const usersRes = await api.get('/users');
         setSupervisors(usersRes.data.filter(u => u.role === 'Supervisor'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const handleUpdateDates = async () => {
    const newStart = window.prompt('Enter new Start Date (YYYY-MM-DD):', new Date(tournament.startDate).toISOString().split('T')[0]);
    if (!newStart) return;
    const newEnd = window.prompt('Enter new End Date (YYYY-MM-DD):', new Date(tournament.endDate).toISOString().split('T')[0]);
    if (!newEnd) return;
    try {
      await api.put(`/tournaments/${id}`, { startDate: newStart, endDate: newEnd });
      fetchData(); // Refresh Data
    } catch (err) {
      alert('Error updating dates');
    }
  };

  const handleSupervisorChange = async (e) => {
    try {
      await api.put(`/tournaments/${id}`, { supervisor: e.target.value || null });
      fetchData(); // Refresh Data
    } catch (err) {
      alert('Error assigning supervisor');
    }
  };

  const handleDeleteTournament = async () => {
    if (window.confirm(`WARNING: Are you sure you want to delete "${tournament.name}"? This will also delete all associated teams, matches, and standings. THIS ACTION CANNOT BE UNDONE.`)) {
      try {
        await api.delete(`/tournaments/${id}`);
        navigate('/dashboard');
      } catch (err) {
        console.error("Error deleting tournament", err);
        alert(err.response?.data?.message || "Failed to delete tournament");
      }
    }
  };

  if (!tournament) return (
     <div className="flex justify-center items-center h-64">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
     </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Profile */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border-0">
        <div className="premium-gradient-bg px-8 py-12 text-white relative">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
             <Trophy className="w-96 h-96" />
          </div>
          <div className="flex items-center space-x-6 relative z-10">
            <div className="bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/30 shadow-inner">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">{tournament.name}</h1>
                {user && user.role === 'Admin' && (
                  <button 
                    onClick={handleDeleteTournament}
                    className="bg-red-600/40 hover:bg-red-600/60 backdrop-blur-sm p-2 rounded-lg border border-white/20 transition-all group"
                    title="Delete Tournament"
                  >
                    <Trash2 className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
              <p className="text-indigo-50 mt-3 flex items-center flex-wrap gap-2 font-medium">
                 <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded border border-white/20 text-sm tracking-wider uppercase drop-shadow-sm">{tournament.sportType}</span>
                 <span className="flex items-center">
                   <Calendar className="w-4 h-4 mx-1" />
                   {new Date(tournament.startDate).toLocaleDateString()} &rarr; {new Date(tournament.endDate).toLocaleDateString()}
                 </span>
                 {user && (user.role === 'Admin' || (user.role === 'Supervisor' && tournament.supervisor === user._id)) && (
                    <button onClick={handleUpdateDates} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded border border-white/20 text-xs tracking-wider uppercase drop-shadow-sm transition font-bold ml-2">
                        Edit Dates
                    </button>
                 )}
                 {user && user.role === 'Admin' && (
                    <select 
                      onChange={handleSupervisorChange} 
                      value={tournament.supervisor || ''}
                      className="ml-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2 py-1 rounded border border-white/20 text-xs tracking-wider uppercase drop-shadow-sm font-bold text-white outline-none cursor-pointer"
                    >
                      <option value="" className="text-black">No Supervisor</option>
                      {supervisors.map(s => <option key={s._id} value={s._id} className="text-black">{s.name}</option>)}
                    </select>
                 )}
              </p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-4 bg-white/50 dark:bg-gray-900/50">
          {['overview', 'teams', 'matches', 'standings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-all duration-300 ${activeTab === tab ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on tab */}
      <div className="glass-panel p-6 sm:p-8 min-h-[400px] rounded-2xl">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                 <Users className="h-10 w-10 text-indigo-500 mb-3 animate-float" />
                 <h3 className="text-3xl font-black text-gray-900 dark:text-white">{teams.length}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide mt-1">Registered Teams</p>
               </div>
               <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                 <Calendar className="h-10 w-10 text-blue-500 mb-3 animate-float" style={{ animationDelay: '0.2s' }} />
                 <h3 className="text-3xl font-black text-gray-900 dark:text-white">{matches.length}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide mt-1">Scheduled Matches</p>
               </div>
               <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                 <Award className="h-10 w-10 text-purple-500 mb-3 animate-float" style={{ animationDelay: '0.4s' }} />
                 <h3 className="text-3xl font-black text-gray-900 dark:text-white">{standings.length > 0 && standings[0].points > 0 ? standings[0].teamId?.name || '-' : '-'}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide mt-1">Current Leader</p>
               </div>
            </div>
            

          </div>
        )}

        {activeTab === 'teams' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white relative inline-block">
                Participating Teams
                <span className="absolute -bottom-2 left-0 w-12 h-1 premium-gradient-bg rounded-full"></span>
              </h2>
              {user && (user.role === 'Admin' || user.role === 'Manager') && (
                 <Link to={`/tournaments/${id}/register-team`} className="sports-skew-btn w-auto !py-2 !px-6 !text-sm">
                   + Add Team
                 </Link>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.length === 0 ? <p className="text-gray-500 dark:text-gray-400 col-span-full py-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">No teams registered yet.</p> : teams.map(team => (
                <div key={team._id} className="glass-card p-5 flex flex-col justify-between">
                   <div className="flex items-center space-x-4 mb-4">
                     <div className="premium-gradient-bg h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                       {team.name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                       <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{team.name}</h3>
                       <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">{team.players.length} players</p>
                     </div>
                   </div>
                   {user && (user.role === 'Admin' || user.role === 'Manager' || user._id === team.manager?._id) && (
                      <Link to={`/teams/${team._id}/manage`} className="text-center w-full block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors py-2 rounded-none text-sm font-bold uppercase tracking-wider">Manage Team</Link>
                   )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">Match Schedule</h2>
              {user && (user.role === 'Admin' || (user.role === 'Supervisor' && tournament.supervisor === user._id)) && (
                 <Link to={`/tournaments/${id}/schedule-match`} className="sports-skew-btn w-auto !py-2 !px-4 !text-sm flex items-center">
                   + Auto-Schedule / Create
                 </Link>
              )}
            </div>
            
            <div className="space-y-4">
               {matches.length === 0 ? <p className="text-slate-500 dark:text-slate-400 font-medium">No matches scheduled.</p> : matches.map(match => (
                 <div key={match._id} className="border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] rounded-none flex flex-col md:flex-row overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                   <div className="bg-slate-50 dark:bg-[#121826] p-4 md:w-48 flex flex-col justify-center border-b-2 md:border-b-0 md:border-r-2 border-slate-200 dark:border-slate-800">
                     <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{match.status}</div>
                     <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1 uppercase">{match.date ? new Date(match.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'TBD'}</div>
                   </div>
                   <div className="p-4 flex-1 flex justify-between items-center">
                     <div className="flex-1 text-right font-display text-2xl uppercase text-slate-800 dark:text-slate-100 leading-none">{match.teamA?.name}</div>
                     <div className="font-display text-3xl font-black bg-slate-900 dark:bg-slate-800 text-white dark:text-white rounded-none mx-6 px-4 py-1 shadow-inner h-full flex items-center min-w-[80px] justify-center">
                       {match.status === 'Completed' || match.status === 'Ongoing' ? <span className="text-red-500">{match.scoreA}</span> : 'V'}
                       {match.status === 'Completed' || match.status === 'Ongoing' ? <span className="text-white mx-1">-</span> : <span className="text-white">S</span>}
                       {match.status === 'Completed' || match.status === 'Ongoing' ? <span className="text-red-500">{match.scoreB}</span> : ''}
                     </div>
                     <div className="flex-1 font-display text-2xl uppercase text-slate-800 dark:text-slate-100 leading-none">{match.teamB?.name}</div>
                   </div>
                   {user && (user.role === 'Admin' || (user.role === 'Supervisor' && tournament.supervisor === user._id)) && match.status !== 'Completed' && (
                      <div className="p-4 bg-slate-50 dark:bg-[#121826] border-t-2 md:border-t-0 md:border-l-2 border-slate-200 dark:border-slate-800 flex items-center justify-center">
                        <Link to={`/matches/${match._id}/update`} className="text-red-600 dark:text-red-500 text-sm font-bold tracking-widest uppercase hover:underline">Update</Link>
                      </div>
                   )}
                 </div>
               ))}
            </div>
          </div>
        )}

    {activeTab === 'standings' && (
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-6">Leaderboard</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-[#121826] text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4 font-medium rounded-tl-lg">Pos</th>
                    <th className="p-4 font-medium">Team</th>
                    <th className="p-4 font-medium text-center">P</th>
                    <th className="p-4 font-medium text-center">W</th>
                    <th className="p-4 font-medium text-center">D</th>
                    <th className="p-4 font-medium text-center">L</th>
                    <th className="p-4 font-medium text-center text-red-600">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {standings.length === 0 ? (
                    <tr><td colSpan="7" className="p-4 text-center text-slate-500 dark:text-slate-400">No standings available.</td></tr>
                  ) : standings.map((standing, index) => (
                    <tr key={standing._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">{index + 1}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{standing.teamId?.name}</td>
                      <td className="p-4 text-center text-slate-600 dark:text-slate-300">{standing.wins + standing.losses + standing.draws}</td>
                      <td className="p-4 text-center text-slate-600 dark:text-slate-300">{standing.wins}</td>
                      <td className="p-4 text-center text-slate-600 dark:text-slate-300">{standing.draws}</td>
                      <td className="p-4 text-center text-slate-600 dark:text-slate-300">{standing.losses}</td>
                      <td className="p-4 text-center font-bold text-red-600 text-lg">{standing.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentDetails;
