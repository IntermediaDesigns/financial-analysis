"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Models } from "appwrite";
import { loginUser, createUserAccount, getCurrentUser, logout } from "../lib/appwrite";
import { toast } from "../hooks/use-toast";

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function signIn(email: string, password: string) {
        try {
            const { user } = await loginUser(email, password);
            setUser(user);
            toast({
                title: "Success",
                description: "Successfully signed in",
            });
            router.push("/");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to sign in. Please check your credentials.",
                variant: "destructive",
            });
            throw error;
        }
    }

    async function signUp(email: string, password: string, name: string) {
        try {
            const user = await createUserAccount(email, password, name);
            setUser(user);
            toast({
                title: "Success",
                description: "Account created successfully",
            });
            router.push("/");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create account. Please try again.",
                variant: "destructive",
            });
            throw error;
        }
    }

    async function signOut() {
        try {
            await logout();
            setUser(null);
            toast({
                title: "Success",
                description: "Successfully signed out",
            });
            router.push("/login");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to sign out",
                variant: "destructive",
            });
            throw error;
        }
    }

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
