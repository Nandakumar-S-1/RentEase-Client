import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  MapPin,
  Home,
  CreditCard,
  Activity,
  FileText,
  User as UserIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
} from "lucide-react";
import {
  getUserById,
  suspendUser,
  activateUser,
  getUserProperties,
} from "../services/adminService";
import {
  getUserActivity,
  getTenantKycDocument,
  getUserPayments,
} from "../services/adminDataService";
import {
  getOwnerVerificationDetails,
  type OwnerVerificationDetails,
} from "../services/adminVerificationService";
import type { UserResponse } from "../types/adminTypes";
import type { PropertyData } from "../../property/types/propertyTypes";
import type { Notification } from "../../notifications/types/notificationTypes";
import type { AdminPayment } from "../types/adminPaymentTypes";
import { RoleTypes } from "../../../types/constants/role.constant";
import { PAGE_ROUTES } from "../../../config/routes";
import { LoadingOverlay, Pagination } from "../../../components/common";
import { formatRelativeTime } from "../../../utils/dateUtils";

const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [verification, setVerification] =
    useState<OwnerVerificationDetails | null>(null);
  const [tenantKyc, setTenantKyc] = useState<{
    documentUrl: string | null;
    agreementNumber: string;
    agreementId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [propPagination, setPropPagination] = useState({
    page: 1,
    total: 0,
    limit: 6,
    pages: 1,
  });
  const [propLoading, setPropLoading] = useState(false);
  const [activity, setActivity] = useState<Notification[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [paymentPagination, setPaymentPagination] = useState({
    page: 1,
    total: 0,
    limit: 10,
    pages: 1,
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "PROPERTIES" | "PAYMENTS" | "ACTIVITY" | "DOCUMENTS"
  >("DOCUMENTS");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const userResponse = await getUserById(id);
        setUser(userResponse.data);

        if (userResponse.data.role === RoleTypes.OWNER_USER) {
          const verifyResponse = await getOwnerVerificationDetails(id);
          setVerification(verifyResponse.data);
        } else if (userResponse.data.role === RoleTypes.TENANT_USER) {
          // Fetch tenant KYC document
          const kycResponse = await getTenantKycDocument(id);
          setTenantKyc(kycResponse);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const fetchUserProperties = useCallback(
    async (page: number) => {
      if (!id) return;
      try {
        setPropLoading(true);
        const response = await getUserProperties(
          id,
          page,
          propPagination.limit,
        );
        if (response.success) {
          setProperties(response.data.properties);
          setPropPagination({
            page: response.data.page,
            total: response.data.total,
            limit: response.data.limit,
            pages: Math.ceil(response.data.total / response.data.limit),
          });
        }
      } catch (error) {
        console.error("Error fetching user properties:", error);
      } finally {
        setPropLoading(false);
      }
    },
    [id, propPagination.limit],
  );

  const fetchUserActivity = useCallback(async () => {
    if (!id) return;
    try {
      setActivityLoading(true);
      const result = await getUserActivity(id, 1, 20);
      setActivity(result);
    } catch (error) {
      console.error("Error fetching user activity:", error);
    } finally {
      setActivityLoading(false);
    }
  }, [id]);

  const fetchUserPayments = useCallback(
    async (page: number) => {
      if (!id) return;
      try {
        setPaymentLoading(true);
        const result = await getUserPayments(id, page, paymentPagination.limit);
        setPayments(result.payments);
        setPaymentPagination({
          page: result.page,
          total: result.total,
          limit: result.limit,
          pages: result.pages,
        });
      } catch (error) {
        console.error("Error fetching user payments:", error);
      } finally {
        setPaymentLoading(false);
      }
    },
    [id, paymentPagination.limit],
  );

  useEffect(() => {
    if (activeTab === "PROPERTIES" && id) {
      fetchUserProperties(1);
    }
    if (activeTab === "ACTIVITY" && id) {
      fetchUserActivity();
    }
    if (activeTab === "PAYMENTS" && id) {
      fetchUserPayments(1);
    }
  }, [activeTab, id, fetchUserProperties, fetchUserActivity, fetchUserPayments]);

  const handleStatusToggle = async () => {
    if (!user) return;
    try {
      if (user.isSuspended) {
        await activateUser(user.id);
        setUser({ ...user, isSuspended: false });
      } else {
        await suspendUser(user.id);
        setUser({ ...user, isSuspended: true });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  if (loading) return <LoadingOverlay />;
  if (!user) return <div className="p-8 text-center">User not found</div>;

  const tabs = [
    { id: "PROPERTIES", label: "Properties", icon: Home },
    { id: "PAYMENTS", label: "Payments", icon: CreditCard },
    { id: "ACTIVITY", label: "Activity Log", icon: Activity },
    { id: "DOCUMENTS", label: "Documents", icon: FileText },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "PROPERTY_ADDED":
      case "PROPERTY_APPROVED":
        return <Home className="w-4 h-4" />;
      case "AGREEMENT_CREATED":
      case "AGREEMENT_SIGNED":
      case "AGREEMENT_ACTIVATED":
        return <FileText className="w-4 h-4" />;
      case "PAYMENT_RECEIVED":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(PAGE_ROUTES.ADMIN_USERS)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Users
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleStatusToggle}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              user.isSuspended
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
            }`}
          >
            {user.isSuspended ? "Reactivate User" : "Suspend User"}
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-sm">
            Send Message
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

            <div className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-xl">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon size={40} className="text-primary" />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.fullname}
              </h2>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">
                {user.role}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${
                    user.isSuspended
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {user.isSuspended ? (
                    <XCircle size={12} />
                  ) : (
                    <CheckCircle size={12} />
                  )}
                  {user.isSuspended ? "Suspended" : "Active"}
                </span>
                {user.isEmailVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
                    <Shield size={12} />
                    Verified
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-4 pt-8 border-t border-gray-50 dark:border-gray-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.phone || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    Joined
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-1 flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | "PROPERTIES"
                      | "PAYMENTS"
                      | "ACTIVITY"
                      | "DOCUMENTS",
                  )
                }
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <tab.icon size={18} />
                <span className="text-sm font-bold">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px]">
            {activeTab === "DOCUMENTS" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {user.role === RoleTypes.TENANT_USER
                      ? "KYC Document"
                      : "Verification Documents"}
                  </h3>
                  {verification?.status === "PENDING" && (
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-yellow-100">
                      Action Required
                    </span>
                  )}
                </div>

                {user.role === RoleTypes.TENANT_USER ? (
                  // Display tenant KYC document
                  tenantKyc && tenantKyc.documentUrl ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
                            Agreement Number
                          </p>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {tenantKyc.agreementNumber}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
                            Document Type
                          </p>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            KYC Document
                          </p>
                        </div>
                      </div>

                      <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                            KYC Document
                          </span>
                          <a
                            href={tenantKyc.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary text-xs font-bold hover:underline"
                          >
                            View Full Screen
                          </a>
                        </div>
                        <div className="p-8 flex items-center justify-center">
                          <img
                            src={tenantKyc.documentUrl}
                            alt="Tenant KYC Document"
                            className="max-h-96 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-3">
                        <FileText size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No KYC document submitted yet.
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Tenant will upload KYC when signing an agreement.
                      </p>
                    </div>
                  )
                ) : user.role === RoleTypes.OWNER_USER ? (
                  // Display owner verification documents
                  verification ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
                            Document Type
                          </p>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {verification.documentType || "Aadhaar / PAN"}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
                            Status
                          </p>
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                              verification.status === "VERIFIED"
                                ? "text-green-600"
                                : verification.status === "REJECTED"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                verification.status === "VERIFIED"
                                  ? "bg-green-600"
                                  : verification.status === "REJECTED"
                                    ? "bg-red-600"
                                    : "bg-yellow-600"
                              }`}
                            />
                            {verification.status}
                          </span>
                        </div>
                      </div>

                      <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                            Document Scan
                          </span>
                          <a
                            href={verification.documentUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary text-xs font-bold hover:underline"
                          >
                            View Full Screen
                          </a>
                        </div>
                        <div className="p-8 flex items-center justify-center">
                          {verification.documentUrl ? (
                            <img
                              src={verification.documentUrl}
                              alt="Verification Document"
                              className="max-h-96 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                            />
                          ) : (
                            <div className="text-center py-12">
                              <FileText
                                size={48}
                                className="text-gray-200 dark:text-gray-700 mx-auto mb-3"
                              />
                              <p className="text-gray-400 font-medium">
                                Document image not available
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {verification.rejectionReason && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
                          <p className="text-xs font-bold text-red-600 mb-1">
                            Rejection Reason
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-400">
                            {verification.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-3">
                        <FileText size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No verification documents submitted yet.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-3">
                      <AlertCircle size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No documents required for this user type.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "PROPERTIES" && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {user.role === RoleTypes.OWNER_USER
                      ? "Owned Properties"
                      : "Rented Properties"}
                  </h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-xl text-xs font-bold">
                    {propPagination.total} Total
                  </span>
                </div>

                {propLoading && properties.length === 0 ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-24 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : properties.length > 0 ? (
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <div
                        key={property.id}
                        onClick={() =>
                          navigate(
                            PAGE_ROUTES.ADMIN_PROPERTY_DETAIL.replace(
                              ":id",
                              property.id,
                            ),
                          )
                        }
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-primary/20"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={
                              property.photos[property.primaryPhotoIndex] ||
                              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                            }
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-white truncate">
                            {property.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin size={12} /> {property.locationCity}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs font-black text-primary">
                              ₹{property.monthlyRent.toLocaleString()}
                            </span>
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                property.status === "ACTIVE" ||
                                property.status === "APPROVED"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : property.status === "UNLISTED"
                                    ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                    : property.status === "REJECTED"
                                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }`}
                            >
                              {property.status === "ACTIVE" ||
                              property.status === "APPROVED"
                                ? "Listed"
                                : property.status === "PENDING_APPROVAL"
                                  ? "Pending"
                                  : property.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {propPagination.pages > 1 && (
                      <Pagination
                        page={propPagination.page}
                        total={propPagination.total}
                        totalPages={propPagination.pages}
                        limit={propPagination.limit}
                        itemName="properties"
                        onPageChange={fetchUserProperties}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                    <Home size={40} className="mb-3 opacity-20" />
                    <p className="text-sm font-medium">No properties found.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "ACTIVITY" && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Activity Log
                  </h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-xl text-xs font-bold">
                    {activity.length} Events
                  </span>
                </div>

                {activityLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : activity.length > 0 ? (
                  <div className="space-y-3">
                    {activity.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div
                          className={`p-2 rounded-xl ${
                            item.isRead
                              ? "bg-gray-200 dark:bg-gray-700"
                              : "bg-primary/10"
                          }`}
                        >
                          <span
                            className={
                              item.isRead ? "text-gray-400" : "text-primary"
                            }
                          >
                            {getNotificationIcon(
                              item.notificationType as string,
                            )}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`font-bold text-sm ${
                                item.isRead
                                  ? "text-gray-500"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {item.title}
                            </p>
                            <span className="text-[10px] text-gray-400 shrink-0">
                              {formatRelativeTime(item.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.message}
                          </p>
                        </div>
                        {!item.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                    <Activity size={40} className="mb-3 opacity-20" />
                    <p className="text-sm font-medium">
                      No activity recorded yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "PAYMENTS" && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Payment History
                  </h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-xl text-xs font-bold">
                    {paymentPagination.total} Total
                  </span>
                </div>

                {paymentLoading && payments.length === 0 ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                      >
                        <div
                          className={`p-2 rounded-xl ${
                            payment.status === "PAID"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : payment.status === "OVERDUE"
                                ? "bg-red-100 dark:bg-red-900/30"
                                : "bg-yellow-100 dark:bg-yellow-900/30"
                          }`}
                        >
                          <CreditCard
                            size={18}
                            className={
                              payment.status === "PAID"
                                ? "text-green-600"
                                : payment.status === "OVERDUE"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              ₹{payment.amount.toLocaleString()}
                              <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                {payment.category}
                              </span>
                            </p>
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                payment.status === "PAID"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : payment.status === "OVERDUE"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Agreement {payment.agreement.agreementNumber}
                            {payment.dueDate && (
                              <span className="ml-2">
                                · Due{" "}
                                {new Date(payment.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            {payment.paidDate && (
                              <span className="ml-2">
                                · Paid{" "}
                                {new Date(
                                  payment.paidDate,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}

                    {paymentPagination.pages > 1 && (
                      <Pagination
                        page={paymentPagination.page}
                        total={paymentPagination.total}
                        totalPages={paymentPagination.pages}
                        limit={paymentPagination.limit}
                        itemName="payments"
                        onPageChange={fetchUserPayments}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                    <CreditCard size={40} className="mb-3 opacity-20" />
                    <p className="text-sm font-medium">
                      No payments found for this user.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
