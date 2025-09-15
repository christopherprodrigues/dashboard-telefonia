interface Call {
    source: string;
    destination: string;
    duration: number;
    sip_code: number;
}

interface CallsTableProps {
    data: Call[];
    loading: boolean;
}

export function CallsTable({ data, loading }: CallsTableProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalhes das Chamadas</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Duração (s)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cód. SIP</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-4 text-gray-400">Carregando dados...</td></tr>
                        ) : (
                            data.map((call, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{call.source}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{call.destination}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">{call.duration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">{call.sip_code}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}