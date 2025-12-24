
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';

interface User {
    id: string;
    username: string;
    role: 'operator' | 'quality' | 'manager' | 'admin';
    competency_level?: number;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    switchRole: (role: 'operator' | 'quality' | 'manager' | 'admin') => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const switchRole = (newRole: 'operator' | 'quality' | 'manager' | 'admin') => {
        if (!user) return;

        let updatedUser: User;

        // Persona Definitions for Demo
        switch (newRole) {
            case 'admin':
                updatedUser = { ...user, id: '1', username: 'Yusuf Admin', role: 'admin' };
                break;
            case 'manager':
                updatedUser = { ...user, id: '3', username: 'Project Manager', role: 'manager' };
                break;
            case 'quality':
                updatedUser = { ...user, id: '4', username: 'Quality Engineer', role: 'quality' };
                break;
            case 'operator':
            default:
                updatedUser = { ...user, id: '2', username: 'Field Operator', role: 'operator' };
                break;
        }

        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, switchRole, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
