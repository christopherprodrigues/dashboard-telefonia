import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { EyeIcon } from '../components/EyeIcon'; // Importa o ícone

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    // Validação de email simples
    const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        // Validação de formulário
        if (!email || !password) {
            setError('Por favor, preencha ambos os campos.');
            return;
        }
        if (!isEmailValid(email)) {
            setError('Por favor, insira um email válido.');
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);

            const response = await api.post('/token', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            login(response.data.access_token, email);
        } catch (err) {
            setError('Email ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
            <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-sm m-4 animate-fadeIn">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
                    Baldussi Telecom
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="seu@email.com" disabled={loading} />
                    </div>
                    <div className="mb-6 relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">Senha</label>
                        <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="********" disabled={loading} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-500 hover:text-gray-700"><EyeIcon isOpen={showPassword} /></button>
                    </div>
                    {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:bg-gray-400">
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}