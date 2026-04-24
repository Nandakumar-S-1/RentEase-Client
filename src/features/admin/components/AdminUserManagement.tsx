import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  UserCheck,
  UserX,
  Users,
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
    if (user.isSuspended) return "bg-red-50 text-red-600";
    if (!user.isActive) return "bg-gray-50 text-gray-500";
    if (user.isEmailVerified) return "bg-green-50 text-green-600";
    return "bg-yellow-50 text-yellow-600";
  };

  const getStatusLabel = (user: UserResponse) => {
    if (user.isSuspended) return "Suspended";
    if (!user.isActive) return "Inactive";
    if (user.isEmailVerified) return "Verified";
    return "Pending";
  };

  const getStatusDot = (user: UserResponse) => {
    if (user.isSuspended) return "bg-red-600";
    if (!user.isActive) return "bg-gray-600";
    if (user.isEmailVerified) return "bg-green-600";
    return "bg-yellow-600";
  };

  return (
    <div className="bg-[color:var(--color-surface)] rounded-[2.5rem] p-10 border border-[color:var(--color-border)] shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          <button className="flex items-center gap-2 px-8 py-4 bg-[color:var(--color-surface)] border-2 border-[color:var(--color-border)] text-[color:var(--color-foreground)] font-black rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm group">
             <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
             Export Users
          </button>
        </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setUserType("OWNERS")}
          className={`px-4 py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
            userType === "OWNERS"
              ? "text-primary border-primary"
              : "text-gray-600 border-transparent hover:text-gray-900"
          }`}
        >
          <Users size={18} />
          Owners
        </button>
        <button
          onClick={() => setUserType("TENANTS")}
          className={`px-4 py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
            userType === "TENANTS"
              ? "text-primary border-primary"
              : "text-gray-600 border-transparent hover:text-gray-900"
          }`}
        >
          <Users size={18} />
          Tenants
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute inset-y-0 left-3 my-auto text-gray-400"
            />
            <input
              type="text"
              placeholder="Search user..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50">
            <Filter size={16} className="text-gray-400" />
          </button>
        </div>

        <Table<UserResponse>
          columns={[
            {
              header: "User",
              key: "user",
              render: (user) => (
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white overflow-hidden ${
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
                    <p className="text-sm font-bold text-gray-900">
                      {user.fullname}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      ID: {user.id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              header: "Contact",
              key: "contact",
              render: (user) => (
                <div>
                  <p className="text-xs text-gray-600">{user.email}</p>
                  <p className="text-[10px] text-gray-400">{user.phone}</p>
                </div>
              ),
            },
            {
              header: "Role",
              key: "role",
              render: (user) => (
                <div className="text-center">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      userType === "OWNERS"
                        ? "bg-primary/10 text-primary"
                        : "bg-purple-50 text-purple-600"
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
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold ${getStatusStyles(
                      user,
                    )}`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${getStatusDot(user)}`}
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
                <span className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              ),
            },
            {
              header: "Actions",
              key: "actions",
              render: (user) => (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(user);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  {user.isSuspended ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openConfirmModal(user.id, "ACTIVATE");
                      }}
                      className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                      title="Activate User"
                    >
                      <UserCheck size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openConfirmModal(user.id, "SUSPEND");
                      }}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                      title="Suspend User"
                    >
                      <UserX size={16} />
                    </button>
                  )}
                </div>
              ),
            },
          ]}
          data={filteredUsers}
          isLoading={loading}
          emptyMessage={`No ${userType.toLowerCase()} found.`}
        />

        <div className="p-6 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {filteredUsers.length} of {pagination.total}{" "}
            {userType.toLowerCase()}
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="px-3 py-1 text-xs font-bold border border-gray-200 rounded-lg text-gray-400 disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 h-8 flex items-center justify-center text-xs font-bold border rounded-lg transition-all ${
                  pagination.page === i + 1
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="px-3 py-1 text-xs font-bold border border-gray-200 bg-white rounded-lg text-gray-900 shadow-sm disabled:opacity-50 hover:bg-gray-50"
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
