import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { Calendar } from 'lucide-react';

const ScheduleMatch = () => {
  const { tournamentId } = useParams();
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    teamA: '',
    teamB: '',
    date: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get(`/teams/tournament/${tournamentId}`);
        setTeams(res.data);
      } catch (err) {
         setError('Failed to load teams');
      }
    };
    fetchTeams();
  }, [tournamentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.teamA === formData.teamB) {
      return setError('Team A and Team B cannot be the same team');
    }
    try {
      await api.post('/matches', { ...formData, tournamentId });
      navigate(`/tournaments/${tournamentId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error scheduling match');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="glass-panel p-8 border-t-4 border-red-600">
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="bg-red-600 p-2 text-white shadow-md">
            <Calendar className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-display uppercase tracking-widest text-slate-900 dark:text-white">Schedule Fixture</h1>
        </div>

        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 mb-4 text-sm font-bold border border-red-200 dark:border-red-800">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 border-2 border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-[#121826]">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-1">Corner A</label>
              <select
                name="teamA"
                required
                value={formData.teamA}
                onChange={handleChange}
                className="mt-1 block w-full bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 focus:border-red-600 dark:focus:border-red-500 focus:ring-0 p-3 font-bold uppercase"
              >
                <option value="">Select Bracket</option>
                {teams.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-1">Corner B</label>
              <select
                name="teamB"
                required
                value={formData.teamB}
                onChange={handleChange}
                className="mt-1 block w-full bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 focus:border-red-600 dark:focus:border-red-500 focus:ring-0 p-3 font-bold uppercase"
              >
                <option value="">Select Bracket</option>
                {teams.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-1">Fixture Time</label>
            <input
              type="datetime-local"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 focus:border-red-600 dark:focus:border-red-500 focus:ring-0 p-3 font-bold"
            />
          </div>

          <div className="pt-6 flex justify-end space-x-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              Cancel
            </button>
            <button type="submit" className="sports-skew-btn w-auto !px-8 !py-3">
              Lock In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMatch;
