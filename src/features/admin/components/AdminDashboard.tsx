import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  Home,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { PAGE_ROUTES } from "../../../config/routes";
import { axiosApi as api } from "../../../services/api/axiosInstance";

interface DashboardStats {
  totalUsers: number;
  totalOwners: number;
  totalTenants: number;
  pendingVerifications: number;
  totalAgreements: number;
  activeAgreements: number;
  pendingPaymentAgreements: number;
  totalPayments: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersRes = await api.get("/admin/users?limit=1");
        const totalUsers = usersRes.data.data.total || 0;

        // Fetch pending owners
        const ownersRes = await api.get("/admin/owners/pending?limit=1");
        const pendingVerifications = ownersRes.data.data.total || 0;

        // Fetch agreements
        const agreementsRes = await api.get("/admin/agreements?limit=1");
        const totalAgreements = agreementsRes.data.data.total || 0;

        // Fetch active agreements
        const activeRes = await api.get(
          "/admin/agreements?limit=1&status=ACTIVE",
        );
        const activeAgreements = activeRes.data.data.total || 0;

        // Fetch pending payment agreements
        const pendingPayRes = await api.get(
          "/admin/agreements?limit=1&status=PENDING_PAYMENT",
        );
        const pendingPaymentAgreements = pendingPayRes.data.data.total || 0;

        // Fetch payments
        const paymentsRes = await api.get(
          "/admin/payments?limit=100&status=PAID",
        );
        const payments = paymentsRes.data.data.payments || [];
        const totalRevenue = payments.reduce(
          (sum: number, p: { amount: number }) => sum + p.amount,
          0,
        );

        setStats({
          totalUsers,
          totalOwners: 0,
          totalTenants: 0,
          pendingVerifications,
          totalAgreements,
          activeAgreements,
          pendingPaymentAgreements,
          totalPayments: payments.length,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      link: PAGE_ROUTES.ADMIN_USERS,
    },
    {
      title: "Pending Verifications",
      value: stats?.pendingVerifications || 0,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      link: PAGE_ROUTES.ADMIN_OWNERS,
    },
    {
      title: "Total Agreements",
      value: stats?.totalAgreements || 0,
      icon: FileText,
      color: "bg-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      link: PAGE_ROUTES.ADMIN_AGREEMENTS,
    },
    {
      title: "Active Agreements",
      value: stats?.activeAgreements || 0,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      link: PAGE_ROUTES.ADMIN_AGREEMENTS,
    },
    {
      title: "Pending Payments",
      value: stats?.pendingPaymentAgreements || 0,
      icon: AlertCircle,
      color: "bg-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      link: PAGE_ROUTES.ADMIN_AGREEMENTS,
    },
    {
      title: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      link: PAGE_ROUTES.ADMIN_PAYMENTS,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-32 bg-[color:var(--color-surface)] rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--color-foreground)]">
            Platform Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor your platform's performance and activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-3xl font-black text-[color:var(--color-foreground)] mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon
                  className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View details <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[color:var(--color-foreground)]">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to={PAGE_ROUTES.ADMIN_USERS}
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Manage Users</span>
            </Link>
            <Link
              to={PAGE_ROUTES.ADMIN_OWNERS}
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Verify Owners</span>
            </Link>
            <Link
              to={PAGE_ROUTES.ADMIN_PROPERTIES}
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Home className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Review Properties</span>
            </Link>
            <Link
              to={PAGE_ROUTES.ADMIN_AGREEMENTS}
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">View Agreements</span>
            </Link>
          </div>
        </div>

        <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[color:var(--color-foreground)]">
              System Status
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">API Server</span>
              </div>
              <span className="text-xs font-bold text-green-600">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">Database</span>
              </div>
              <span className="text-xs font-bold text-green-600">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">Payment Gateway</span>
              </div>
              <span className="text-xs font-bold text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
