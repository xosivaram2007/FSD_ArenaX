import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Users, UserMinus, Plus, Trash2, ArrowLeft } from 'lucide-react';

const ManageTeam = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState('Player');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/teams/${teamId}`);
      setTeam(res.data);
    } catch (err) {
      setError('Could not load team details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    try {
      await api.put(`/teams/${teamId}/players`, { player: { name: newPlayerName, role: newPlayerRole } });
      setNewPlayerName('');
      setNewPlayerRole('Player');
      fetchTeam(); // Refresh
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding player');
    }
  };

  const handleRemovePlayer = async (playerName) => {
    try {
      await api.delete(`/teams/${teamId}/players/${playerName}`);
      fetchTeam(); // Refresh
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing player');
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm(`Are you sure you want to delete ${team.name}?`)) return;
    try {
      await api.delete(`/teams/${teamId}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting team');
    }
  };

  if (loading) return <div className="text-center py-12 dark:text-gray-100">Loading Team...</div>;
  if (!team) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="text-sm font-medium text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
        <div className="absolute -right-16 -top-16 opacity-5 dark:opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-110">
          <Users className="h-64 w-64 text-indigo-500" />
        </div>
        
        <div className="relative z-10 flex justify-between items-start mb-8">
           <div>
              <h1 className="text-3xl font-bold dark:text-white mb-2">{team.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 inline-block px-3 py-1 rounded-full font-medium">
                Manager: {team.manager?.name || 'Unknown'}
              </p>
           </div>
           
           <button 
             onClick={handleDeleteTeam} 
             className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center transition"
           >
             <Trash2 className="h-4 w-4 mr-1" /> Delete Team
           </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg mb-6 text-sm">{error}</div>}

        <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
           <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
             <h2 className="font-bold text-gray-800 dark:text-gray-100">Team Roster</h2>
           </div>
           
           <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {team.players.length === 0 ? (
                 <li className="p-6 text-center text-gray-500 dark:text-gray-400">No members added yet.</li>
              ) : team.players.map((player, idx) => (
                 <li key={idx} className={`flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${player.role === 'Coach' ? 'bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500' : ''}`}>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-200 block">{player.name}</span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${player.role === 'Coach' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>{player.role}</span>
                    </div>
                    <button 
                      onClick={() => handleRemovePlayer(player.name)}
                      className="text-red-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                      title="Remove player"
                    >
                      <UserMinus className="h-5 w-5" />
                    </button>
                 </li>
              ))}
           </ul>

           <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
              <form onSubmit={handleAddPlayer} className="flex space-x-3">
                 <input
                   type="text"
                   required
                   value={newPlayerName}
                   onChange={(e) => setNewPlayerName(e.target.value)}
                   className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white px-4 py-2"
                   placeholder="Enter member name"
                 />
                 <select 
                   value={newPlayerRole}
                   onChange={(e) => setNewPlayerRole(e.target.value)}
                   className="rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white px-4 py-2"
                 >
                   <option value="Player">Player</option>
                   <option value="Coach">Coach</option>
                 </select>
                 <button 
                   type="submit"
                   className="premium-gradient-bg text-white px-6 py-2 rounded-lg font-medium flex items-center"
                 >
                   <Plus className="h-5 w-5 mr-1" /> Add
                 </button>
              </form>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ManageTeam;
