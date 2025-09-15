import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { KpiCard } from '../components/KpiCard';
import { CallsChart } from '../components/CallsChart';
import { CallsTable } from '../components/CallsTable';
import { UserIcon } from '../components/UserIcon';

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
    const { logout, userEmail } = useAuth();
    const [kpis, setKpis] = useState<KpiData | null>(null);
    const [calls, setCalls] = useState<CallData[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="text-gray-600 hover:text-blue-600 focus:outline-none"
                        >
                            <UserIcon />
                        </button>
                        {dropdownOpen && (
                            <div
                                className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-20"
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="text-sm text-gray-600">Logado como</p>
                                    <p className="text-sm font-medium text-gray-900 truncate" title={userEmail || ''}>
                                        {userEmail || 'Usuário'}
                                    </p>
                                </div>
                                <div className="py-1">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configurações</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</a>
                                </div>
                                <div className="border-t border-gray-200 py-1">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            logout();
                                        }}
                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Sair
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Visão Geral</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    </div>

                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full xl:w-7/12 px-3 mb-6">
                            <CallsChart data={chartData} loading={loading} />
                        </div>
                        <div className="w-full xl:w-5/12 px-3 mb-6">
                            <CallsTable data={calls} loading={loading} />
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}