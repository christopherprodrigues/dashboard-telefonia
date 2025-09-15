import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';

interface ChartData {
    time_period: string;
    call_count: number;
}

interface CallsChartProps {
    data: ChartData[];
    loading: boolean;
    onBarClick: (hour: string) => void;
}

export function CallsChart({ data, loading, onBarClick }: CallsChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const formattedData = data.map(item => ({
        ...item,
        time_period: new Date(item.time_period).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }));

    const handleClick = (data: any, index: number) => {
        onBarClick(data.time_period);
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

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
                        <Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="call_count" name="Nº de Chamadas" radius={[4, 4, 0, 0]}>
                            {formattedData.map((entry, index) => (
                                <Cell
                                    cursor="pointer"
                                    fill={index === activeIndex ? '#1d4ed8' : '#3b82f6'}
                                    key={`cell-${index}`}
                                    onClick={() => handleClick(entry, index)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}