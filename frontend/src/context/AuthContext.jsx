import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          // Try to fetch user data
          const { data } = await axios.get(`/api/auth/me`, config);
          if (data.success) {
            setUser(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching user', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`/api/auth/login`, {
      email,
      password,
    });
    if (data.success) {
      localStorage.setItem('token', data.token);
      setUser(data);
      return data;
    }
  };

  const register = async (name, email, password, role) => {
    const { data } = await axios.post(`/api/auth/register`, {
      name,
      email,
      password,
      role,
    });
    if (data.success) {
      localStorage.setItem('token', data.token);
      setUser(data);
      return data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUserContext = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};
