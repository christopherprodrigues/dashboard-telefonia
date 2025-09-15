import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { KpiCard } from '../components/KpiCard';
import { CallsChart } from '../components/CallsChart';
import { CallsTable } from '../components/CallsTable';

// Definindo os tipos de dados que esperamos da API
interface KpiData {
    total_calls: number;
    answered_calls: number;
    asr: number;
    acd: number;
}
interface CallData {
    id: string;
    source: string;
    destination: string;
    duration: number;
    sip_code: number;
}

export function DashboardPage() {
    const { logout } = useAuth();
    const [kpis, setKpis] = useState<KpiData | null>(null);
    const [calls, setCalls] = useState<CallData[]>([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Fazemos as duas chamadas de API em paralelo
                const [metricsResponse, callsResponse] = await Promise.all([
                    api.get('/metrics/'),
                    api.get('/calls/'),
                ]);

                setKpis(metricsResponse.data.kpis);
                setChartData(metricsResponse.data.calls_over_time);
                setCalls(callsResponse.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                // Em um app real, mostraríamos uma mensagem de erro para o usuário
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []); // O array vazio [] faz com que o useEffect rode apenas uma vez

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">
                        Dashboard de Telefonia
                    </h1>
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    >
                        Sair
                    </button>
                </nav>
            </header>

            <main className="container mx-auto px-6 py-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Visão Geral</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {loading || !kpis ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-8 bg-gray-300 rounded w-1/3 mt-2"></div>
                            </div>
                        ))
                    ) : (
                        <>
                            <KpiCard title="Total de Chamadas" value={kpis.total_calls} />
                            <KpiCard title="Chamadas Atendidas" value={kpis.answered_calls} />
                            <KpiCard title="ASR (Taxa de Atendimento)" value={`${kpis.asr}%`} />
                            <KpiCard title="ACD (Duração Média)" value={`${kpis.acd}s`} />
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <div className="xl:col-span-3">
                        <CallsChart data={chartData} loading={loading} />
                    </div>
                    <div className="xl:col-span-2">
                        <CallsTable data={calls.slice(0, 5)} loading={loading} />
                    </div>
                </div>
            </main>
        </div>
    );
}