import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  UserCheck,
  UserX,
  Users,
  Info,
} from "lucide-react";
import {
  getAllUsers,
  suspendUser,
  activateUser,
} from "../services/adminService";
import type { UserResponse } from "../types/adminTypes";
import { Modal, Toast, Table } from "../../../components/common";
import { RoleTypes } from "../../../types/constants/role.constant";
import type {
  UserType,
  RoleType,
} from "../../../types/constants/role.constant";
import { useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../../../config/routes";

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<UserResponse[]>([]);
  const [userType, setUserType] = useState<UserType>("OWNERS");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    action: "SUSPEND" | "ACTIVATE" | null;
  }>({ isOpen: false, userId: null, action: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchUsers = useCallback(
    async (page = 1, role: RoleType) => {
      try {
        setLoading(true);
        const response = await getAllUsers(page, pagination.limit, role);
        if (response.success) {
          setAllUsers(response.data.users);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit],
  );

  useEffect(() => {
    const role =
      userType === "OWNERS" ? RoleTypes.OWNER_USER : RoleTypes.TENANT_USER;
    fetchUsers(1, role);
  }, [userType, fetchUsers]);

  const handleConfirmAction = async () => {
    if (!confirmModal.userId || !confirmModal.action) return;

    try {
      setActionLoading(true);
      if (confirmModal.action === "SUSPEND") {
        await suspendUser(confirmModal.userId);
        setToast({ message: "User suspended successfully.", type: "success" });
      } else {
        await activateUser(confirmModal.userId);
        setToast({
          message: "User reactivated successfully.",
          type: "success",
        });
      }
      const role =
        userType === "OWNERS" ? RoleTypes.OWNER_USER : RoleTypes.TENANT_USER;
      fetchUsers(pagination.page, role);
      setConfirmModal({ isOpen: false, userId: null, action: null });
    } catch (error) {
      console.error("Action failed:", error);
      setToast({ message: "Failed to update user status.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const openConfirmModal = (userId: string, action: "SUSPEND" | "ACTIVATE") => {
    setConfirmModal({ isOpen: true, userId, action });
  };

  const handlePageChange = (newPage: number) => {
    const role =
      userType === "OWNERS" ? RoleTypes.OWNER_USER : RoleTypes.TENANT_USER;
    fetchUsers(newPage, role);
  };

  const handleViewDetails = (user: UserResponse) => {
    navigate(PAGE_ROUTES.ADMIN_USER_DETAIL.replace(":id", user.id));
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusStyles = (user: UserResponse) => {
    if (user.isSuspended) return "bg-red-500/10 text-red-500 border-red-500/20";
    if (!user.isActive)
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    if (user.isEmailVerified)
      return "bg-green-500/10 text-green-500 border-green-500/20";
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  };

  const getStatusLabel = (user: UserResponse) => {
    if (user.isSuspended) return "Suspended";
    if (!user.isActive) return "Inactive";
    if (user.isEmailVerified) return "Verified";
    return "Pending";
  };

  const getStatusDot = (user: UserResponse) => {
    if (user.isSuspended) return "bg-red-500";
    if (!user.isActive) return "bg-gray-500";
    if (user.isEmailVerified) return "bg-green-500";
    return "bg-yellow-500";
  };

  return (
    <div className="bg-[color:var(--color-surface)] rounded-[2.5rem] p-6 lg:p-10 border border-[color:var(--color-border)] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight flex items-center gap-4">
            User Management
            <Users className="text-primary/40" size={32} />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            Manage all platform users and their permissions.
          </p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-[color:var(--color-card)] border border-[color:var(--color-border)] text-[color:var(--color-foreground)] font-black rounded-2xl hover:bg-primary/5 hover:border-primary/30 transition-all text-sm group">
          <Download
            size={18}
            className="group-hover:translate-y-0.5 transition-transform"
          />
          Export Users
        </button>
      </div>

      <div className="flex gap-2 border-b border-[color:var(--color-border)] mb-6">
        <button
          onClick={() => setUserType("OWNERS")}
          className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            userType === "OWNERS"
              ? "text-primary border-primary bg-primary/5"
              : "text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Users size={18} />
          Owners
        </button>
        <button
          onClick={() => setUserType("TENANTS")}
          className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            userType === "TENANTS"
              ? "text-primary border-primary bg-primary/5"
              : "text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Users size={18} />
          Tenants
        </button>
      </div>

      <div className="bg-[color:var(--color-card)] rounded-3xl border border-[color:var(--color-border)] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[color:var(--color-border)] flex flex-wrap items-center gap-4 bg-gray-50/50 dark:bg-white/5">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search
              size={18}
              className="absolute inset-y-0 left-4 my-auto text-gray-400"
            />
            <input
              type="text"
              placeholder={`Search ${userType.toLowerCase()} by name or email...`}
              className="w-full pl-11 pr-4 py-3 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[color:var(--color-foreground)] placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
            <Filter
              size={18}
              className="text-gray-400 group-hover:text-primary"
            />
          </button>

          <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <Info size={14} className="text-amber-500" />
            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-tight">
              User ID is the last 6 chars of system ID
            </p>
          </div>
        </div>

        <Table<UserResponse>
          columns={[
            {
              header: "User",
              key: "user",
              render: (user) => (
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs text-white overflow-hidden shadow-sm ${
                      userType === "OWNERS" ? "bg-primary" : "bg-purple-600"
                    }`}
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.fullname
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black text-[color:var(--color-foreground)]">
                      {user.fullname}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        ID:
                      </span>
                      <span className="text-[10px] font-black text-primary bg-primary/5 px-1.5 py-0.5 rounded-md">
                        {user.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              header: "Contact",
              key: "contact",
              render: (user) => (
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-[color:var(--color-foreground)]">
                    {user.email}
                  </p>
                  <p className="text-[10px] font-bold text-gray-500">
                    {user.phone}
                  </p>
                </div>
              ),
            },
            {
              header: "Role",
              key: "role",
              render: (user) => (
                <div className="text-center">
                  <span
                    className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                      userType === "OWNERS"
                        ? "bg-primary/5 text-primary border-primary/20"
                        : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ),
            },
            {
              header: "Status",
              key: "status",
              render: (user) => (
                <div className="text-center">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(
                      user,
                    )}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${getStatusDot(user)} animate-pulse`}
                    ></div>
                    {getStatusLabel(user)}
                  </span>
                </div>
              ),
            },
            {
              header: "Joined",
              key: "createdAt",
              render: (user) => (
                <div className="text-center">
                  <span className="text-xs font-bold text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ),
            },
            {
              header: "Actions",
              key: "actions",
              render: (user) => (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(user);
                    }}
                    className="p-2 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-primary/10 hover:text-primary hover:border-primary/30 rounded-xl text-gray-400 transition-all shadow-sm"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  {user.isSuspended ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openConfirmModal(user.id, "ACTIVATE");
                      }}
                      className="p-2 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/30 rounded-xl text-gray-400 transition-all shadow-sm"
                      title="Activate User"
                    >
                      <UserCheck size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openConfirmModal(user.id, "SUSPEND");
                      }}
                      className="p-2 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30 rounded-xl text-gray-400 transition-all shadow-sm"
                      title="Suspend User"
                    >
                      <UserX size={18} />
                    </button>
                  )}
                </div>
              ),
            },
          ]}
          data={filteredUsers}
          isLoading={loading}
          emptyMessage={`No ${userType.toLowerCase()} found matching your search.`}
        />

        <div className="p-6 bg-gray-50/50 dark:bg-white/5 flex flex-col sm:flex-row items-center justify-between border-t border-[color:var(--color-border)] gap-4">
          <p className="text-xs font-bold text-gray-500">
            Showing{" "}
            <span className="text-[color:var(--color-foreground)]">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="text-[color:var(--color-foreground)]">
              {pagination.total}
            </span>{" "}
            {userType.toLowerCase()}
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="px-4 py-2 text-xs font-black border border-[color:var(--color-border)] bg-[color:var(--color-surface)] rounded-xl text-[color:var(--color-foreground)] disabled:opacity-50 hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              Previous
            </button>
            <div className="flex gap-1.5 mx-2">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center text-xs font-black border rounded-xl transition-all shadow-sm ${
                    pagination.page === i + 1
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110"
                      : "bg-[color:var(--color-surface)] border-[color:var(--color-border)] text-gray-500 hover:border-primary/40"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="px-4 py-2 text-xs font-black border border-[color:var(--color-border)] bg-[color:var(--color-surface)] rounded-xl text-[color:var(--color-foreground)] disabled:opacity-50 hover:bg-primary/5 hover:border-primary/30 transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          !actionLoading &&
          setConfirmModal({ isOpen: false, userId: null, action: null })
        }
        onConfirm={handleConfirmAction}
        title={
          confirmModal.action === "SUSPEND" ? "Suspend User" : "Activate User"
        }
        description={
          confirmModal.action === "SUSPEND"
            ? "Are you sure you want to suspend this user? They will be immediately logged out and unable to access the platform."
            : "Are you sure you want to reactivate this user? They will regain full access to the platform."
        }
        confirmText={confirmModal.action === "SUSPEND" ? "Suspend" : "Activate"}
        isDestructive={confirmModal.action === "SUSPEND"}
        isLoading={actionLoading}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminUserManagement;
