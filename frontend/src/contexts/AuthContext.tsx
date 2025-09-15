import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface AuthContextType {
    isAuthenticated: boolean;
    userEmail: string | null;
    login: (token: string, email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
    const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));
    const navigate = useNavigate();

    useEffect(() => {
        // Se temos um token, configuramos o header padrão do axios
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    const login = (newToken: string, email: string) => {
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('userEmail', email);
        setToken(newToken);
        setUserEmail(email);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        navigate('/');
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
        navigate('/login'); // Redireciona para o login após o logout
    };

    const value = {
        isAuthenticated: !!token,
        token,
        userEmail,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}