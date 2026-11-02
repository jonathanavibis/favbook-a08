"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastContext";

export interface User {
  id?: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, redirectUrl?: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, image?: string) => Promise<boolean>;
  socialLogin: (userObj: { name: string; email: string; image?: string; provider?: string }, redirectUrl?: string) => Promise<boolean>;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://favbook-a08-server.vercel.app";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  // Load session from localStorage and BetterAuth on initial mount
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const storedToken = localStorage.getItem("bookhype_token");
        const storedUser = localStorage.getItem("bookhype_user");

        if (storedToken && storedUser) {
          if (isMounted) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        } else {
          // Check BetterAuth session (e.g. after Google or GitHub OAuth callback)
          try {
            const res = await fetch("/api/auth/get-session");
            if (res.ok) {
              const sessionData = await res.json();
              if (sessionData?.user && isMounted) {
                const betterUser: User = {
                  id: sessionData.user.id || sessionData.user._id,
                  name: sessionData.user.name || "Reader",
                  email: sessionData.user.email,
                  image: sessionData.user.image,
                };
                const sessToken = sessionData.session?.token || "better_auth_session";
                setUser(betterUser);
                setToken(sessToken);
                localStorage.setItem("bookhype_token", sessToken);
                localStorage.setItem("bookhype_user", JSON.stringify(betterUser));
              }
            }
          } catch (e) {
            console.warn("[BetterAuth Session Check Warning]:", e);
          }
        }
      } catch (err) {
        console.error("Failed to restore session", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  const login = async (email: string, password: string, redirectUrl: string = "/"): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Login failed. Please check your credentials.");
        return false;
      }

      const receivedToken = data.token;
      const receivedUser: User = data.user;

      setToken(receivedToken);
      setUser(receivedUser);

      localStorage.setItem("bookhype_token", receivedToken);
      localStorage.setItem("bookhype_user", JSON.stringify(receivedUser));

      toast.success(data.message || `Welcome back, ${receivedUser.name}!`);
      router.push(redirectUrl);
      return true;
    } catch (err: unknown) {
      console.error("Login request error", err);
      toast.error("Network error: Unable to reach the authentication server.");
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    image?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, image }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Registration failed. Please check the requirements.");
        return false;
      }

      toast.success("Account created successfully! Please sign in with your credentials.");
      router.push("/login");
      return true;
    } catch (err: unknown) {
      console.error("Register request error", err);
      toast.error("Network error: Unable to complete registration.");
      return false;
    }
  };

  const socialLogin = async (
    userObj: { name: string; email: string; image?: string; provider?: string },
    redirectUrl: string = "/"
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userObj),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Social authentication failed.");
        return false;
      }

      const receivedToken = data.token;
      const receivedUser: User = data.user;

      setToken(receivedToken);
      setUser(receivedUser);

      localStorage.setItem("bookhype_token", receivedToken);
      localStorage.setItem("bookhype_user", JSON.stringify(receivedUser));

      toast.success(`Signed in as ${receivedUser.name}`);
      router.push(redirectUrl);
      return true;
    } catch (err: unknown) {
      console.error("Social login request error", err);
      toast.error("Network error: Social sign in service unavailable.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bookhype_token");
    localStorage.removeItem("bookhype_user");
    // Also sign out from BetterAuth
    fetch("/api/auth/sign-out", { method: "POST" }).catch(() => {});
    toast.info("You have been signed out of BookNook.");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        socialLogin,
        logout,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
