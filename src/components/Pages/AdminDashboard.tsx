import { ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Platform Console</h1>
                    <p className="text-gray-500 max-w-md mx-auto">Welcome to the RentEase Admin Control Center.<br/> Use the sidebar to manage users and monitor platform activity.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
