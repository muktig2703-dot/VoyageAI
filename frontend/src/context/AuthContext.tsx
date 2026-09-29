"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(
      "voyageai_access_token"
    );

    if (!storedToken) {
      setLoading(false);
      return;
    }

    const verifyUser = async () => {
      try {
        const response = await fetch(
          `${API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Invalid session");
        }

        const currentUser: User = await response.json();

        setToken(storedToken);
        setUser(currentUser);

        localStorage.setItem(
          "voyageai_user",
          JSON.stringify(currentUser)
        );
      } catch {
        localStorage.removeItem(
          "voyageai_access_token"
        );

        localStorage.removeItem(
          "voyageai_user"
        );

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (
    newToken: string,
    newUser: User
  ) => {
    localStorage.setItem(
      "voyageai_access_token",
      newToken
    );

    localStorage.setItem(
      "voyageai_user",
      JSON.stringify(newUser)
    );

    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(
      "voyageai_access_token"
    );

    localStorage.removeItem(
      "voyageai_user"
    );

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}