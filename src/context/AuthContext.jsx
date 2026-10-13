import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fitai_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('fitai_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.data) {
            setUser((prev) => {
              const updated = { ...prev, ...res.data };
              localStorage.setItem('fitai_user', JSON.stringify(updated));
              return updated;
            });
          }
        } catch (err) {
          // Only clear credentials on a definitive 401 (token truly invalid/expired).
          // On network errors (e.g. Render cold start), keep cached user to avoid
          // logging out a valid user during backend warmup.
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            logout();
          } else {
            console.warn('[FitAI] Could not verify session (network/server error). Using cached credentials.');
          }
        }
      }
      setLoading(false);
    };

    verifySession();
  }, [token]);


  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success && res.data) {
      const { token: jwtToken, ...userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('fitai_token', jwtToken);
      localStorage.setItem('fitai_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (email, password, fullName) => {
    const res = await authApi.register(email, password, fullName);
    if (res.success && res.data) {
      const { token: jwtToken, ...userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('fitai_token', jwtToken);
      localStorage.setItem('fitai_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fitai_token');
    localStorage.removeItem('fitai_user');
  };

  const updateProfileState = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('fitai_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfileState,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'ROLE_ADMIN',
    hasCompletedOnboarding: Boolean(user?.hasCompletedOnboarding),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
