import { ok } from "assert";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  loginWithPassword: (
    login: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  register: (info: {
    userId: string;
    nickname: string;
    email: string;
    password: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  updateNickname: (nickname: string) => Promise<void>;
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

  // no-op placeholder removed; actual context value assembled below in `memo`.
  // augment with password-based flows using local store (demo)
  // Lazy import to keep this file lightweight in SSR
  const loginWithPassword: AuthContextValue["loginWithPassword"] = async (
    loginStr,
    password
  ) => {
    try {
      const req = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginStr, pwd: password }),
      });

      const res = await req.json();
      console.log(res);
      if (req.ok) {
        const token = res.accessToken;
        setUser({ id: res.userId, name: res.nickname, email: res.email });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token }));
        return { ok: true };
      }
      return { ok: false, error: res.error };
    } catch (e) {
      return { ok: false, error: "로그인 중 오류가 발생했습니다." };
    }
  };

  const register: AuthContextValue["register"] = async (info) => {
    try {
      const req = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: info.email,
          pwd: info.password,
          pwdCheck: info.password,
          name: info.nickname,
        }),
      });

      console.log(req);

      if (req.ok) {
        console.log(req);
        const signInRes = await loginWithPassword(info.email, info.password);
        if (signInRes.ok) return { ok: true };
      }
      return { ok: false, error: "회원가입 중 오류가 발생했습니다." };
    } catch {
      return { ok: false, error: "회원가입 중 오류가 발생했습니다." };
    }
  };

  const memo = useMemo<AuthContextValue>(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user,
      loginWithPassword,
      register,
      updateNickname: async (nickname: string) => {
        setUser((prev) => {
          if (!prev) return prev;
          const next = { ...prev, name: nickname };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {}
          return next;
        });
        try {
          const mod = await import("./authStore");
          const key = user?.email || user?.id || "";
          if (key) mod.updateNickname(key, nickname);
        } catch {}
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={memo}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
