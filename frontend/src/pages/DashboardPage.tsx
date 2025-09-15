import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { KpiCard } from '../components/KpiCard';
import { CallsChart } from '../components/CallsChart';
import { CallsTable } from '../components/CallsTable';

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
interface ChartDataPoint {
    time_period: string;
    call_count: number;
}

export function DashboardPage() {
    const { logout } = useAuth();
    const [kpis, setKpis] = useState<KpiData | null>(null);
    const [calls, setCalls] = useState<CallData[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [metricsResponse, callsResponse] = await Promise.all([
                    api.get('/metrics/'),
                    api.get('/calls/'),
                ]);

                setKpis(metricsResponse.data.kpis);
                setChartData(metricsResponse.data.calls_over_time);
                setCalls(callsResponse.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            {/* O cabeçalho agora faz parte da página de conteúdo */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    >
                        Sair
                    </button>
                </div>
            </header>

            {/* O conteúdo principal com rolagem independente */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Visão Geral</h2>

                    {/* Seção de KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {loading || !kpis ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                    <div className="h-8 bg-gray-300 rounded w-1/3"></div>
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

                    {/* Seção de Gráfico e Tabela */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                        <div className="xl:col-span-3">
                            <CallsChart data={chartData} loading={loading} />
                        </div>
                        <div className="xl:col-span-2">
                            {/* Mostra apenas as 5 chamadas mais recentes na pré-visualização */}
                            <CallsTable data={calls.slice(0, 5)} loading={loading} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}