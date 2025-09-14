export function CallsTable() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md col-span-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Detalhes das Chamadas</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duração (s)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cód. SIP</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* As linhas de dados virão aqui */}
                        <tr>
                            <td colSpan={4} className="text-center py-4 text-gray-400">Carregando dados...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}