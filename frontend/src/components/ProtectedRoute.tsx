import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Se o usuário não estiver autenticado, redireciona para a página de login
        return <Navigate to="/login" replace />;
    }

    // Se estiver autenticado, renderiza o componente filho (a página do dashboard)
    return <>{children}</>;
}