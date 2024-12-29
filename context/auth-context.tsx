// context/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { Models } from 'appwrite';
import { getCurrentUser, loginUser, logout, createUserAccount } from '@/lib/appwrite';

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

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string) {
        try {
            await loginUser(email, password);
            await checkUser();
        } catch (error) {
            throw error;
        }
    }

    async function register(email: string, password: string, name: string) {
        try {
            await createUserAccount(email, password, name);
            await checkUser();
        } catch (error) {
            throw error;
        }
    }

    async function handleLogout() {
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error(error);
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