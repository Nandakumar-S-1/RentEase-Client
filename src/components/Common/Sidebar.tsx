import React from 'react';
import {
    LayoutDashboard,
    Building2,
    FileText,
    CreditCard,
    Wrench,
    MessageSquare,
    Settings,
    LogOut,
    Users,
    Flag,
    BarChart3,
    Bookmark
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

interface SidebarProps {
    role: 'ADMIN' | 'OWNER' | 'TENANT';
    userName: string;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, userName, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = {
        OWNER: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
            { icon: <Building2 size={20} />, label: 'My Properties', path: '/owner/properties' },
            { icon: <FileText size={20} />, label: 'Agreements', path: '/owner/agreements' },
            { icon: <CreditCard size={20} />, label: 'Payments', path: '/owner/payments' },
            { icon: <Wrench size={20} />, label: 'Maintenance', path: '/owner/maintenance' },
            { icon: <MessageSquare size={20} />, label: 'Messages', path: '/owner/messages' },
            { icon: <Bookmark size={20} />, label: 'Subscription', path: '/owner/subscription' },
        ],
        TENANT: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
            { icon: <Building2 size={20} />, label: 'Find Property', path: '/tenant/search' },
            { icon: <FileText size={20} />, label: 'Agreement', path: '/tenant/agreements' },
            { icon: <CreditCard size={20} />, label: 'Payments', path: '/tenant/payments' },
            { icon: <Wrench size={20} />, label: 'Maintenance', path: '/tenant/maintenance' },
            { icon: <MessageSquare size={20} />, label: 'Messages', path: '/tenant/messages' },
            { icon: <Bookmark size={20} />, label: 'Wishlist', path: '/tenant/wishlist' },
        ],
        ADMIN: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
            { icon: <Users size={20} />, label: 'User Management', path: '/admin/users' },
            { icon: <Building2 size={20} />, label: 'Properties', path: '/admin/properties' },
            { icon: <FileText size={20} />, label: 'Agreements', path: '/admin/agreements' },
            { icon: <CreditCard size={20} />, label: 'Payments', path: '/admin/payments' },
            { icon: <Flag size={20} />, label: 'Flagged Content', path: '/admin/flagged' },
            { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin/analytics' },
            { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
        ]
    };

    const currentMenu = menuItems[role] || [];

    return (
        <div className="flex flex-col h-screen w-64 bg-[#1e2235] text-gray-400 p-4">
            <div className="mb-8 pl-2">
                <Logo className="text-white" />
            </div>

            <div className="px-2 mb-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {role.charAt(0) + role.slice(1).toLowerCase()} Dashboard
            </div>

            <nav className="flex-1 space-y-1">
                {currentMenu.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${isActive
                                ? 'bg-primary text-white'
                                : 'hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-gray-800 pt-4">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#4338ca] text-white font-bold text-sm">
                        {userName ? userName.split(' ').map(n => n[0]).join('') : '??'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{role.toLowerCase()}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
