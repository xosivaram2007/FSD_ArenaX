import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Trophy, LogOut, User, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b-4 border-b-slate-200 dark:border-b-red-900/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group transition-transform hover:-translate-y-0.5">
            <div className="bg-red-600 p-2 transform -skew-x-12">
              <Trophy className="h-6 w-6 text-white transform skew-x-12" />
            </div>
            <span className="font-display text-3xl hidden sm:block tracking-wider uppercase text-slate-900 dark:text-white mt-1 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">ArenaX</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={toggleTheme}
              className="p-2 bg-slate-100 dark:bg-slate-800 rounded-none text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500 transition-colors border border-slate-200 dark:border-slate-700"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {user ? (
              <>
                <Link to="/dashboard" className="font-display text-xl uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-500 transition-colors mt-1">Command Center</Link>
                <div className="flex items-center space-x-3 border-l-2 border-slate-200 dark:border-slate-800 pl-6 h-10">
                  <User className="h-5 w-5 text-slate-400" />
                  <div className="flex flex-col leading-none">
                    <span className="font-bold text-sm tracking-tight">{user.name}</span>
                    <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-500 transition-colors ml-2"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="font-display text-xl uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-500 transition-colors mt-1">Login</Link>
                <Link to="/register" className="sports-skew-btn text-lg px-6 py-1.5 ml-2">Enlist</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
