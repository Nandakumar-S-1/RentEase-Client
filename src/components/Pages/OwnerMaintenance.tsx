import React, { useEffect, useState } from "react";
import {
  type MaintenanceRequest,
  MaintenanceStatus,
} from "../../features/maintenance/types/maintenance";
import { maintenanceService } from "../../features/maintenance/services/maintenance.service";
import {
  Wrench,
  AlertCircle,
  Clock,
  CheckCircle,
  User,
  MapPin,
} from "lucide-react";
import DashboardLayout from "../common/DashboardLayout";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";
import type { RoleType } from "../../types/constants/role.constant";

export const OwnerMaintenance: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch maintenance requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case MaintenanceStatus.PENDING:
        return (
          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Clock size={14} /> Needs Action
          </span>
        );
      case MaintenanceStatus.ASSIGNED:
        return (
          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Wrench size={14} /> Assigned
          </span>
        );
      case MaintenanceStatus.IN_PROGRESS:
        return (
          <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Wrench size={14} /> In Progress
          </span>
        );
      case MaintenanceStatus.COMPLETED:
        return (
          <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <CheckCircle size={14} /> Completed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <AlertCircle size={14} /> {status}
          </span>
        );
    }
  };

  return (
    <DashboardLayout
      role={user?.role as RoleType}
      userName={user?.fullname || "User"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Maintenance Management
            </h1>
            <p className="text-gray-500 mt-1">
              Review tenant requests and assign service providers.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              All Clear!
            </h3>
            <p className="text-gray-500">
              There are currently no active maintenance requests from your
              tenants.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                          #{req.requestNumber}
                        </span>
                        {getStatusBadge(req.status)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {req.issueTitle}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {req.issueDescription}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                      <MapPin size={14} className="text-primary" />{" "}
                      {req.propertyTitle}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                      <User size={14} className="text-primary" />{" "}
                      {req.tenantName}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-white/5 pt-4 md:pt-0 md:pl-6">
                  {req.status === MaintenanceStatus.PENDING ? (
                    <button className="w-full bg-primary text-white px-4 py-3 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                      <Wrench size={16} />
                      Assign Provider
                    </button>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">
                        Assigned To
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {req.providerName || "Service Provider"}
                      </p>
                      <button className="w-full mt-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-bold text-xs hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                        Update Status
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
