import { MenuIcon } from './MenuIcon';
import { DashboardIcon } from './DashboardIcon';
import { PhoneIcon } from './PhoneIcon';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const menuItems = [
        { name: 'Dashboard', icon: <DashboardIcon /> },
        { name: 'Ramais', icon: <PhoneIcon /> },
    ];

    return (
        <div className={`bg-[#0d1a2e] text-gray-300 flex flex-col transition-all duration-300 ease-in-out relative ${sidebarOpen ? 'w-64' : 'w-20'}`}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-9 z-20 bg-blue-600 p-1.5 rounded-full text-white hover:bg-blue-700">
                <MenuIcon />
            </button>

            <div className="h-20 flex items-center justify-center border-b border-gray-700">
                <h1 className={`text-2xl font-bold text-white transition-opacity duration-200 ${!sidebarOpen && 'opacity-0 whitespace-nowrap'}`}>
                    Baldussi
                </h1>
            </div>

            <nav className="flex-grow p-4">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.name} title={item.name} className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${item.name === 'Dashboard' ? 'bg-blue-600 text-white' : ''}`}>
                            <span className="flex-shrink-0">{item.icon}</span>
                            <span className={`ml-4 transition-opacity duration-200 ${!sidebarOpen && 'opacity-0 whitespace-nowrap'}`}>{item.name}</span>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}