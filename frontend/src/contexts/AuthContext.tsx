import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
    const navigate = useNavigate();

    useEffect(() => {
        // Se temos um token, configuramos o header padrão do axios
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    const login = (newToken: string) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        navigate('/'); // Redireciona para o dashboard após o login
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
        navigate('/login'); // Redireciona para o login após o logout
    };

    const value = {
        isAuthenticated: !!token,
        token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}