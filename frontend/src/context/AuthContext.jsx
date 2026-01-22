// src/context/AuthContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { auth } from "../utils/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => auth.getCurrentUser());
  const [loading] = useState(false);

  const login = (email, password, rememberMe) => {
    const result = auth.login(email, password, rememberMe);
    if (result.success) setUser(result.session.user);
    return result;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const register = (userData) => auth.register(userData);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      register,
      loading,
      isAuthenticated: !!user,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};