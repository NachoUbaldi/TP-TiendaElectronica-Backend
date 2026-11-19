import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
  getUserProfile,
  updateUserProfile,
  STORAGE_KEYS
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      getUserProfile()
        .then((res) => {
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
          }
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      const jwtToken = res?.loginUser?.token;
      const loggedUser = res?.loginUser?.user;
      if (!jwtToken) throw new Error('Respuesta de autenticación inválida');
      localStorage.setItem(STORAGE_KEYS.TOKEN, jwtToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedUser));
      setToken(jwtToken);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await apiRegister(formData);
      const jwtToken = res?.createdUser;
      if (jwtToken) {
        const newUser = {
          name: formData.name,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          role: 'admin'
        };
        localStorage.setItem(STORAGE_KEYS.TOKEN, jwtToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
        setToken(jwtToken);
        setUser(newUser);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) await apiLogout();
    } catch {
      // ignore network error on logout
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (payload) => {
    const res = await updateUserProfile(payload);
    if (res?.data) {
      setUser(res.data);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
    }
    return res?.data;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        isAdmin: Boolean(token && (!user?.role || user.role === 'admin')),
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

