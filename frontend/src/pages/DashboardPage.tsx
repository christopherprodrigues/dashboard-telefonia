import { useAuth } from '../contexts/AuthContext';
import { KpiCard } from '../components/KpiCard';
import { CallsChart } from '../components/CallsChart';
import { CallsTable } from '../components/CallsTable';

export function DashboardPage() {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                        Sair
                    </button>
                </nav>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Grid para os KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KpiCard title="Total de Chamadas" value="..." />
                    <KpiCard title="Chamadas Atendidas" value="..." />
                    <KpiCard title="ASR (Taxa de Atendimento)" value="...%" />
                    <KpiCard title="ACD (Duração Média)" value="...s" />
                </div>

                {/* Grid para o gráfico e a tabela */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* O gráfico ocupará 2 colunas no grid de 4 */}
                    <div className="lg:col-span-2">
                        <CallsChart />
                    </div>
                    {/* A tabela ocupará as 4 colunas */}
                    <div className="lg:col-span-4">
                        <CallsTable />
                    </div>
                </div>
            </main>
        </div>
    );
}