import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // ტოკენიდან იუზერის სახელის ამოღება (დეკოდირება მარტივად)
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));
        setUser({
          username: payload.username || "მომხმარებელი",
          id: payload.user_id,
        });
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  // შესვლის ფუნქცია
  const login = async (username, password) => {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
      username,
      password,
    });
    localStorage.setItem("token", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    setToken(res.data.access);
    return res.data;
  };

  // რეგისტრაციის ფუნქცია
  const register = async (username, email, password) => {
    await axios.post("http://127.0.0.1:8000/api/auth/register/", {
      username,
      email,
      password,
    });
  };

  // სისტემიდან გამოსვლა
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
