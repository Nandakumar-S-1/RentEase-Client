import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  IndianRupee,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { getAllPayments } from "../services/adminDataService";
import type { AdminPayment } from "../types/adminPaymentTypes";
import { LoadingOverlay, Pagination } from "../../../components/common";

const statusColors: Record<string, { bg: string; icon: typeof CheckCircle }> = {
  PENDING: { bg: "bg-yellow-100 text-yellow-700", icon: Clock },
  PAID: { bg: "bg-green-100 text-green-700", icon: CheckCircle },
  FAILED: { bg: "bg-red-100 text-red-700", icon: XCircle },
  REFUNDED: { bg: "bg-gray-100 text-gray-700", icon: XCircle },
};

const categoryColors: Record<string, string> = {
  SECURITY_DEPOSIT: "bg-purple-100 text-purple-700",
  RENT: "bg-blue-100 text-blue-700",
  MAINTENANCE: "bg-orange-100 text-orange-700",
  LATE_FEE: "bg-red-100 text-red-700",
};

const AdminPayments = () => {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    limit: 10,
    pages: 1,
  });

  const fetchPayments = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const result = await getAllPayments(
          page,
          pagination.limit,
          statusFilter || undefined,
          categoryFilter || undefined,
        );
        setPayments(result.payments);
        setPagination((prev) => ({
          ...prev,
          page: result.page,
          total: result.total,
          pages: result.pages,
        }));
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit, statusFilter, categoryFilter],
  );

  useEffect(() => {
    fetchPayments(1);
  }, [statusFilter, categoryFilter, fetchPayments]);

  const handlePageChange = (page: number) => {
    fetchPayments(page);
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--color-foreground)]">
            All Payments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage all payment transactions
          </p>
        </div>
        {!loading && payments.length > 0 && (
          <div className="bg-primary/10 px-4 py-2 rounded-xl">
            <p className="text-xs text-gray-500">Total on this page</p>
            <p className="text-lg font-bold text-primary flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              {totalAmount.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Categories</option>
            <option value="SECURITY_DEPOSIT">Security Deposit</option>
            <option value="RENT">Rent</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="LATE_FEE">Late Fee</option>
          </select>
        </div>
      </div>

      {loading && payments.length === 0 ? (
        <LoadingOverlay />
      ) : payments.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Agreement
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Payer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--color-border)]">
                  {payments.map((payment) => {
                    const StatusIcon =
                      statusColors[payment.status]?.icon || Clock;
                    return (
                      <tr
                        key={payment.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[color:var(--color-foreground)]">
                                {payment.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">
                              {payment.agreement.agreementNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-[color:var(--color-foreground)]">
                                {payment.payer.fullName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {payment.payer.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4 text-gray-400" />
                            <span className="font-bold text-lg">
                              {payment.amount.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              categoryColors[payment.category] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {payment.category.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold ${
                              statusColors[payment.status]?.bg ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {payment.paidDate
                              ? new Date(payment.paidDate).toLocaleDateString()
                              : payment.dueDate
                                ? `Due: ${new Date(payment.dueDate).toLocaleDateString()}`
                                : new Date(
                                    payment.createdAt,
                                  ).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {pagination.pages > 1 && (
            <Pagination
              page={pagination.page}
              total={pagination.total}
              totalPages={pagination.pages}
              limit={pagination.limit}
              itemName="payments"
              onPageChange={handlePageChange}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <CreditCard size={40} className="mb-3 opacity-20 text-gray-400" />
          <p className="text-sm font-medium text-gray-400">No payments found</p>
          <p className="text-xs text-gray-400 mt-1">
            There are no payments matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
