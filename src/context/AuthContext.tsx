import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../services/apiService';

interface AuthUser {
    id: string;
    email: string;
    given_name?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    loginWithGitHub: () => void;
    loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const currentUser = await auth.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        await auth.login(email, password);
        await checkUserStatus();
    };

    const signup = async (email: string, password: string, name: string) => {
        await auth.register(email, password, name);
        await login(email, password); // API registers but might not return token directly, so we login right after.
    };

    const logout = async () => {
        await auth.logout();
        setUser(null);
    };

    const loginWithGitHub = () => { console.warn("GitHub login not yet implemented in FastAPI"); };
    const loginWithGoogle = () => { console.warn("Google login not yet implemented in FastAPI"); };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            signup,
            logout,
            loginWithGitHub,
            loginWithGoogle
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
