import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    time_period: string;
    call_count: number;
}

interface CallsChartProps {
    data: ChartData[];
    loading: boolean;
}

export function CallsChart({ data, loading }: CallsChartProps) {
    const formattedData = data.map(item => ({
        ...item,
        time_period: new Date(item.time_period).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }));

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg h-[450px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chamadas por Hora</h3>
            {loading ? (
                <div className="h-full flex items-center justify-center text-gray-400">Carregando gráfico...</div>
            ) : (
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time_period" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="call_count" fill="#3b82f6" name="Nº de Chamadas" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}