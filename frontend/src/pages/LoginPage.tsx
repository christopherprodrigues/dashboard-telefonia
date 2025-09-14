import React, { useState } from 'react';
import api from '../services/api';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Previne o recarregamento da página
        setError(''); // Limpa erros anteriores

        if (!email || !password) {
            setError('Por favor, preencha ambos os campos.');
            return;
        }

        try {
            // Usa o axios para fazer a chamada POST para /token
            // O FastAPI espera os dados como FormData, então usamos URLSearchParams
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);

            const response = await api.post('/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const { access_token } = response.data;
            console.log('Login bem-sucedido! Token:', access_token);

            // Próximos passos: salvar o token e redirecionar

        } catch (err) {
            console.error('Falha no login:', err);
            setError('Email ou senha inválidos.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Dashboard de Telefonia
                </h1>
                {/* Adiciona o manipulador de envio ao formulário */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email} // Conecta o input ao estado
                            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="seu@email.com"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Senha
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password} // Conecta o input ao estado
                            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="********"
                        />
                    </div>
                    {/* Mostra a mensagem de erro, se houver */}
                    {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}