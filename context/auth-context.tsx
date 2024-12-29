"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Models } from "appwrite";
import {
  getCurrentUser,
  loginUser,
  logout,
  createUserAccount,
} from "../lib/appwrite";
import { useToast } from "../hooks/use-toast";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // Handle specific error cases
      if (error instanceof Error && error.message === 'No active session') {
        // Expected state when user is not logged in
        setUser(null);
      } else {
        console.error("Check user error:", error);
        setUser(null);
        toast({
          title: "Error",
          description: "Failed to verify authentication status",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await loginUser(email, password);
      setUser(response.user);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      toast({
        title: "Error",
        description: "Failed to login",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function register(email: string, password: string, name: string) {
    try {
      const newUser = await createUserAccount(email, password, name);
      setUser(newUser);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
