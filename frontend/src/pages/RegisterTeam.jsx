import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { Users } from 'lucide-react';

const RegisterTeam = () => {
  const { tournamentId } = useParams();
  const [name, setName] = useState('');
  const [players, setPlayers] = useState([{ name: '', role: 'Player' }]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const addPlayerRow = () => {
    setPlayers([...players, { name: '', role: 'Player' }]);
  };
  
  const removePlayerRow = (index) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validPlayers = players.filter(p => p.name.trim() !== '');
      await api.post('/teams', { name, players: validPlayers, tournamentId });
      navigate(`/tournaments/${tournamentId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering team');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="glass-panel p-8 border-t-4 border-red-600">
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="bg-red-600 p-2 text-white shadow-md">
             <Users className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-display uppercase tracking-widest text-slate-900 dark:text-white">Register Team</h1>
        </div>

        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 mb-4 text-sm font-bold border border-red-200 dark:border-red-800">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-1">Team Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 focus:border-red-600 dark:focus:border-red-500 focus:ring-0 p-3 uppercase font-bold"
              placeholder="e.g. THE INVINCIBLES"
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">Team Members</label>
            {players.map((player, idx) => (
              <div key={idx} className="flex space-x-2 mb-2 items-center">
                 <input 
                   type="text" 
                   value={player.name}
                   onChange={e => handlePlayerChange(idx, 'name', e.target.value)}
                   placeholder="Member Name"
                   className="flex-1 bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 focus:border-red-600 dark:focus:border-red-500 focus:ring-0 p-2 uppercase font-bold text-sm"
                 />
                 <select 
                   value={player.role}
                   onChange={e => handlePlayerChange(idx, 'role', e.target.value)}
                   className="w-32 bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 focus:border-red-600 dark:focus:border-red-500 p-2 font-bold text-sm"
                 >
                   <option value="Player">Player</option>
                   <option value="Coach">Coach</option>
                 </select>
                 {players.length > 1 && (
                   <button type="button" onClick={() => removePlayerRow(idx)} className="text-red-500 hover:text-red-700 font-bold p-2">✕</button>
                 )}
              </div>
            ))}
            <button type="button" onClick={addPlayerRow} className="mt-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
               + Add Another Member
            </button>
          </div>

          <div className="pt-6 flex justify-end space-x-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              Cancel
            </button>
            <button type="submit" className="sports-skew-btn w-auto !px-8 !py-3">
              Add Roster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterTeam;
