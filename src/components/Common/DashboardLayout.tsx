import React from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, Settings } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: 'ADMIN' | 'OWNER' | 'TENANT';
    userName: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role, userName }) => {
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar role={role} userName={userName} onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-danger text-white rounded-full border-2 border-white">
                                3
                            </span>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
