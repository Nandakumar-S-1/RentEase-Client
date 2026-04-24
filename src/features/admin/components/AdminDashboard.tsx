import { ShieldCheck } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[color:var(--color-surface)] rounded-[2.5rem] p-10 border border-[color:var(--color-border)] shadow-xl flex flex-col items-center text-center space-y-6">
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center transition-transform hover:rotate-12 duration-500">
          <ShieldCheck className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight">
            Platform Console
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
            Welcome to the RentEase Admin Control Center.
            <br /> <span className="text-primary/80">Manage users and platform activity in real-time.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
