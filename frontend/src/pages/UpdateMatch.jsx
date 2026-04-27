import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const UpdateMatch = () => {
  const { matchId } = useParams();
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [status, setStatus] = useState('Completed');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/matches/${matchId}`, {
        scoreA: parseInt(scoreA),
        scoreB: parseInt(scoreB),
        status
      });
      navigate(-1); // Go back to tournament details
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating match');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="glass-panel p-8 border-t-4 border-red-600">
        <h1 className="text-3xl font-display uppercase tracking-widest text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          Update Scorecard
        </h1>
        
        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 mb-4 text-sm font-bold border border-red-200 dark:border-red-800">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-8 text-center bg-slate-50 dark:bg-[#121826] p-6 border-2 border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">Corner A Score</label>
              <input
                type="number"
                min="0"
                required
                value={scoreA}
                onChange={(e) => setScoreA(e.target.value)}
                className="w-24 text-center text-4xl font-display p-3 border-2 focus:ring-0 bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:border-red-600 mx-auto block font-black text-red-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">Corner B Score</label>
              <input
                type="number"
                min="0"
                required
                value={scoreB}
                onChange={(e) => setScoreB(e.target.value)}
                className="w-24 text-center text-4xl font-display p-3 border-2 focus:ring-0 bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:border-red-600 mx-auto block font-black text-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-1">Live Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 focus:border-red-600 dark:focus:border-red-500 focus:ring-0 p-3 font-bold uppercase tracking-widest"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-l-4 border-red-600 p-4 text-sm font-medium">
            <strong className="uppercase tracking-widest text-red-600">WARNING:</strong> Finalizing a match drops it directly onto the leaderboard parameters. Ensure scores are perfectly verified!
          </div>

          <div className="pt-6 flex justify-end space-x-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              Cancel
            </button>
            <button type="submit" className="sports-skew-btn w-auto !px-8 !py-3">
              Transmit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMatch;
