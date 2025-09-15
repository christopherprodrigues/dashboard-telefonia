export function Sidebar() {
    // Em um app real, os ícones seriam componentes SVG
    const menuItems = [
        { name: 'Dashboard', icon: '📊' },
        { name: 'Ramais', icon: '📞' },
        { name: 'Chamadas', icon: '📲' },
        { name: 'Usuários', icon: '👥' },
        { name: 'Relatórios', icon: '📄' },
        { name: 'Configuração', icon: '⚙️' },
    ];

    return (
        <div className="w-64 bg-[#0d1a2e] text-gray-300 flex flex-col">
            <div className="h-20 flex items-center justify-center border-b border-gray-700">
                {/* Placeholder para o logo da Baldussi */}
                <h1 className="text-2xl font-bold text-white">Baldussi</h1>
            </div>
            <nav className="flex-grow p-4">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.name} className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${item.name === 'Dashboard' ? 'bg-blue-600 text-white' : ''}`}>
                            <span className="mr-4 text-xl">{item.icon}</span>
                            <span>{item.name}</span>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}