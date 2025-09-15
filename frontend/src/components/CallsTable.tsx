import { formatPhoneNumber } from '../utils/formatters';

interface Call {
    id: string;
    source: string;
    destination: string;
    duration: number;
    sip_code: number;
}

interface CallsTableProps {
    data: Call[];
    loading: boolean;
    activeFilter: string | null;
    onClearFilter: () => void;
}

export function CallsTable({ data, loading, activeFilter, onClearFilter }: CallsTableProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg h-[450px] flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-800">Detalhes das Chamadas</h3>
                {activeFilter && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-blue-600 font-medium">
                            Filtro ativo: {activeFilter}
                        </span>
                        <button
                            onClick={onClearFilter}
                            className="text-xs text-red-500 hover:text-red-700"
                            title="Limpar filtro"
                        >
                            &times;
                        </button>
                    </div>
                )}
            </div>
            <div className="flex-grow overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
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
                        ) : data.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-4 text-gray-500">Nenhuma chamada encontrada para este período.</td></tr>
                        ) : (
                            data.map((call) => (
                                <tr key={call.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatPhoneNumber(call.source)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatPhoneNumber(call.destination)}</td>
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