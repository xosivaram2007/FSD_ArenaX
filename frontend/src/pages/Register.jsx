import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trophy } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, 'User');
      navigate('/dashboard');
    } catch (err) {
      // Error handled in context
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 animate-fade-in-up relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-panel p-10 rounded-2xl w-full max-w-md relative z-10 border-white/60 dark:border-gray-700/50">
        <div className="text-center mb-10">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
             <Trophy className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Join to play and follow tournaments</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border-gray-200 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 p-3 bg-white/50 dark:bg-gray-800/50 dark:text-white"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-gray-200 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 p-3 bg-white/50 dark:bg-gray-800/50 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-gray-200 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 p-3 bg-white/50 dark:bg-gray-800/50 dark:text-white"
              placeholder="••••••••"
            />
          </div>


          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white premium-gradient-bg disabled:opacity-50 mt-8"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
