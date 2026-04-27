import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { Shield, ShieldCheck, ShieldAlert, UserCog, Trash2 } from 'lucide-react';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== 'Admin') {
    return <Navigate to="/dashboard" />;
  }

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsersList(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      setUsersList(usersList.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating role", error);
      alert("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      try {
        await api.delete(`/users/${userId}`);
        setUsersList(usersList.filter(u => u._id !== userId));
      } catch (error) {
        console.error("Error deleting user", error);
        alert(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const roleColors = {
    'Admin': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    'Manager': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    'Supervisor': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    'User': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  };

  if (loading) return (
     <div className="flex justify-center items-center h-64">
       <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-red-600 rotate-45"></div>
     </div>
  );

  return (
    <div className="space-y-8 animate-slide-in pb-12 mt-4 max-w-6xl mx-auto">
      <div className="flex items-end justify-between border-b-4 border-slate-200 dark:border-slate-800 pb-4 mb-8">
        <div>
          <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-1 block flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1" /> Authorization Module
          </span>
          <h1 className="text-6xl font-display text-slate-900 dark:text-white leading-none uppercase">Personnel DB</h1>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden border-t-4 border-red-600">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-[#121826] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">
                <th className="p-5 border-b border-slate-200 dark:border-slate-800">User Identification</th>
                <th className="p-5 border-b border-slate-200 dark:border-slate-800">Primary Contact</th>
                <th className="p-5 border-b border-slate-200 dark:border-slate-800">Clearance Level</th>
                <th className="p-5 border-b border-slate-200 dark:border-slate-800 text-right">Modify Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {usersList.map((usr) => (
                <tr key={usr._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-none flex items-center justify-center font-display text-xl text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                        {usr.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">{usr.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">ID: {usr._id.substring(18)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{usr.email}</span>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-none border text-xs font-bold uppercase tracking-widest ${roleColors[usr.role]}`}>
                       {usr.role === 'Admin' && <ShieldAlert className="w-3 h-3 mr-1" />}
                       {usr.role === 'Manager' && <UserCog className="w-3 h-3 mr-1" />}
                       {usr.role === 'Supervisor' && <ShieldCheck className="w-3 h-3 mr-1" />}
                       {usr.role === 'User' && <Shield className="w-3 h-3 mr-1" />}
                       {usr.role}
                    </span>
                  </td>
                  <td className="p-5 text-right flex items-center justify-end space-x-2">
                    {usr._id !== user._id ? (
                      <>
                        <select
                          value={usr.role}
                          onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                          className="bg-white dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-700 text-sm font-bold uppercase text-slate-700 dark:text-slate-300 p-2 focus:ring-red-500 focus:border-red-500 outline-none cursor-pointer"
                        >
                          <option value="User">User</option>
                          <option value="Manager">Manager</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteUser(usr._id, usr.name)}
                          className="p-2 bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors border border-slate-300 dark:border-slate-700"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Self Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
