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
    start_time: string;
}
interface ChartDataPoint {
    time_period: string;
    call_count: number;
}

export function DashboardPage() {
    const { logout, userEmail } = useAuth();
    const [kpis, setKpis] = useState<KpiData | null>(null);
    const [allCalls, setAllCalls] = useState<CallData[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState<string | null>(null);

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
                setAllCalls(callsResponse.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleBarClick = (hour: string) => {
        setSelectedHour((prevHour) => (prevHour === hour ? null : hour));
    };

    const filteredCalls = selectedHour
        ? allCalls.filter(call => {
            const callHour = new Date(call.start_time).getHours();
            const selectedHourInt = parseInt(selectedHour.split(':')[0], 10);
            return callHour === selectedHourInt;
        })
        : allCalls;

    return (
        <>
            <header className="bg-white shadow-sm flex-shrink-0">
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

            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 flex flex-col">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Visão Geral</h2>

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

                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full xl:w-7/12 px-3 mb-6">
                            <CallsChart
                                data={chartData}
                                loading={loading}
                                onBarClick={handleBarClick}
                            />
                        </div>
                        <div className="w-full xl:w-5/12 px-3 mb-6">
                            <CallsTable
                                data={filteredCalls}
                                loading={loading}
                                activeFilter={selectedHour}
                                onClearFilter={() => setSelectedHour(null)}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}