import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, Trophy, CircleUserRound } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative z-10 w-full animate-fade-in-up">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-xl overflow-hidden glass-card shadow-2xl">
        
        {/* Left Side - Visual Splash */}
        <div className="bg-slate-900 hidden md:flex flex-col justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay"></div>
          <div className="absolute -left-1/4 -bottom-1/4 w-full h-full bg-red-600/20 blur-3xl rounded-full"></div>
          <Trophy className="w-32 h-32 text-red-600 mb-8 opacity-80" />
          <h2 className="font-display text-5xl text-white leading-none uppercase tracking-tight">Access Your<br/>Command Center</h2>
          <p className="mt-4 text-slate-400 font-medium">Log in to manage your rosters, update brackets, and track your legacy.</p>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white dark:bg-[#0b0f19] p-10 md:p-14 flex flex-col justify-center relative">
          
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full mb-4">
              <CircleUserRound className="w-8 h-8" />
            </div>
            <h1 className="font-display text-4xl text-slate-900 dark:text-white uppercase tracking-wider">Secure Login</h1>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-8 text-sm font-bold flex items-center border-l-4 border-red-600">
              <ShieldAlert className="w-5 h-5 mr-3 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Secure Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-red-600 dark:focus:border-red-600 text-slate-900 dark:text-white px-4 py-3 rounded-none outline-none transition-colors font-medium"
                placeholder="system@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Passcode</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-red-600 dark:focus:border-red-600 text-slate-900 dark:text-white px-4 py-3 rounded-none outline-none transition-colors font-medium"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="sports-skew-btn mt-4 pt-3 pb-2"
            >
              Authorize Access
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            No active profile? <Link to="/register" className="text-red-600 hover:text-red-700 font-bold uppercase tracking-wider ml-1">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
