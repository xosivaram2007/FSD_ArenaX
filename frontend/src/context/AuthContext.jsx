import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/auth/register', { name, email, password, role });
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
