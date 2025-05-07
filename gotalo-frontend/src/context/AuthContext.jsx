import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext(); 

// Custom hook to use context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // contains id, email, role
  const [accessToken, setAccessToken] = useState(null);

  // On initial load, optionally check for token in cookies or localStorage (optional)
  useEffect(() => {
    // Example: you can refresh token here or load from localStorage
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
    setAccessToken(res.data.accessToken);
    const decoded = parseJwt(res.data.accessToken);
    setUser({ id: decoded.id, role: decoded.role });
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setAccessToken(null);
    setUser(null);
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
