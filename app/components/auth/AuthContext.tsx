import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

type AuthContextValue = {
  user: User | null;
  login: (info: { email: string; name?: string; avatarUrl?: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loginWithPassword: (login: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (info: { userId: string; nickname: string; email: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "auth:user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login: AuthContextValue["login"] = ({ email, name, avatarUrl }) => {
    const fallbackName = name ?? email.split("@")[0] ?? "사용자";
    const u: User = { id: "local", name: fallbackName, email, avatarUrl };
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const value = useMemo<AuthContextValue>(() => ({ user, login, logout, isAuthenticated: !!user }), [user]);
  // augment with password-based flows using local store (demo)
  // Lazy import to keep this file lightweight in SSR
  const loginWithPassword: AuthContextValue["loginWithPassword"] = async (loginStr, password) => {
    try {
      const mod = await import("./authStore");
      const res = await mod.loginWithPassword(loginStr, password);
      if (res.ok) {
        const u = res.user;
        setUser({ id: u.id, name: u.nickname || u.userId, email: u.email });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: u.id, name: u.nickname || u.userId, email: u.email }));
        return { ok: true };
      }
      return { ok: false, error: res.error };
    } catch (e) {
      return { ok: false, error: "로그인 중 오류가 발생했습니다." };
    }
  };

  const register: AuthContextValue["register"] = async (info) => {
    try {
      const mod = await import("./authStore");
      const res = await mod.registerUser(info);
      if (res.ok) {
        const u = res.user;
        setUser({ id: u.id, name: u.nickname || u.userId, email: u.email });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: u.id, name: u.nickname || u.userId, email: u.email }));
        return { ok: true };
      }
      return { ok: false, error: res.error };
    } catch {
      return { ok: false, error: "회원가입 중 오류가 발생했습니다." };
    }
  };

  const memo = useMemo<AuthContextValue>(() => ({
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loginWithPassword,
    register,
  }), [user]);

  return <AuthContext.Provider value={memo}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
