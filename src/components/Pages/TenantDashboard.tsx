import { User } from 'lucide-react';

const TenantDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl p-10 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black mb-2">Welcome to RentEase</h1>
                        <p className="text-indigo-100 max-w-md">Find your perfect home and manage your rental agreements with ease. Your active leases will be shown here.</p>
                    </div>
                </div>
                <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default TenantDashboard;
