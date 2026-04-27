import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Trophy } from 'lucide-react';

const CreateTournament = () => {
  const [formData, setFormData] = useState({
    name: '',
    sportType: '',
    startDate: '',
    endDate: '',
    supervisor: ''
  });
  const [supervisors, setSupervisors] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await api.get('/users');
        setSupervisors(res.data.filter(u => u.role === 'Supervisor'));
      } catch (err) {
        console.error('Failed to fetch supervisors', err);
      }
    };
    fetchSupervisors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tournaments', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating tournament');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in-up">
      <div className="glass-panel rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
          <Trophy className="h-10 w-10 text-indigo-500" />
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Create New Tournament</h1>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tournament Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              placeholder="Summer Championship 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sport Type</label>
            <input
              type="text"
              name="sportType"
              required
              value={formData.sportType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              placeholder="Soccer, Basketball, Esports..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assign Supervisor (Optional)</label>
            <select
              name="supervisor"
              value={formData.supervisor}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              <option value="">-- No Supervisor Assigned --</option>
              {supervisors.map(sup => (
                <option key={sup._id} value={sup._id}>{sup.name} ({sup.email})</option>
              ))}
            </select>
          </div>

          <div className="pt-6 flex justify-end space-x-4 border-t border-gray-100 dark:border-gray-700 mt-8">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 text-sm font-bold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-xl transition">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white premium-gradient-bg rounded-xl shadow-md transition transform hover:-translate-y-0.5">
              Create Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournament;
