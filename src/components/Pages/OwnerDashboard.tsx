import { Home } from 'lucide-react';

const OwnerDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <Home className="w-10 h-10 text-primary" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Owner Dashboard</h1>
                    <p className="text-gray-500 max-w-md mx-auto">Welcome back! Manage your properties, track tenant agreements, and oversee your rental income from this console.</p>
                </div>
                <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 max-w-xl w-full">
                    <p className="text-sm font-medium text-blue-800">Your property listings and payment statistics will appear here once they are active on the platform.</p>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
