import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Calendar,
  User,
  Home,
  IndianRupee,
  ChevronRight,
} from "lucide-react";
import { getAllAgreements } from "../services/adminDataService";
import type { AdminAgreement } from "../types/adminAgreementTypes";
import { LoadingOverlay, Pagination } from "../../../components/common";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING_OWNER_SIGNATURE: "bg-yellow-100 text-yellow-700",
  PENDING_TENANT_SIGNATURE: "bg-orange-100 text-orange-700",
  PENDING_PAYMENT: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-green-100 text-green-700",
  TERMINATED: "bg-red-100 text-red-700",
  EXPIRED: "bg-gray-100 text-gray-600",
};

const AdminAgreements = () => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState<AdminAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    limit: 10,
    pages: 1,
  });

  const fetchAgreements = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const result = await getAllAgreements(
          page,
          pagination.limit,
          statusFilter || undefined,
          search || undefined,
        );
        setAgreements(result.agreements);
        setPagination((prev) => ({
          ...prev,
          page: result.page,
          total: result.total,
          pages: result.pages,
        }));
      } catch (error) {
        console.error("Error fetching agreements:", error);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit, statusFilter, search],
  );

  useEffect(() => {
    fetchAgreements(1);
  }, [statusFilter, fetchAgreements]);

  const handleSearch = () => {
    fetchAgreements(1);
  };

  const handlePageChange = (page: number) => {
    fetchAgreements(page);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--color-foreground)]">
            All Agreements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor all rental agreements
          </p>
        </div>
      </div>

      <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by agreement number, owner, tenant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_OWNER_SIGNATURE">
                Pending Owner Signature
              </option>
              <option value="PENDING_TENANT_SIGNATURE">
                Pending Tenant Signature
              </option>
              <option value="PENDING_PAYMENT">Pending Payment</option>
              <option value="ACTIVE">Active</option>
              <option value="TERMINATED">Terminated</option>
              <option value="EXPIRED">Expired</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {loading && agreements.length === 0 ? (
        <LoadingOverlay />
      ) : agreements.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Agreement
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--color-border)]">
                  {agreements.map((agreement) => (
                    <tr
                      key={agreement.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[color:var(--color-foreground)]">
                              {agreement.agreementNumber}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(
                                agreement.startDate,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-[color:var(--color-foreground)]">
                              {agreement.property.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {agreement.property.locationCity}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-[color:var(--color-foreground)]">
                              continue {agreement.owner.fullName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {agreement.owner.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {agreement.tenant ? (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-[color:var(--color-foreground)]">
                                {agreement.tenant.fullName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {agreement.tenant.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4 text-gray-400" />
                          <span className="font-bold text-sm">
                            {agreement.monthlyRent.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">/mo</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            statusColors[agreement.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {agreement.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate(`/admin/agreements/${agreement.id}`)
                          }
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
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
              itemName="agreements"
              onPageChange={handlePageChange}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FileText size={40} className="mb-3 opacity-20 text-gray-400" />
          <p className="text-sm font-medium text-gray-400">
            No agreements found
          </p>
          <p className="text-xs text-gray-400 mt-1">
            There are no agreements matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminAgreements;
