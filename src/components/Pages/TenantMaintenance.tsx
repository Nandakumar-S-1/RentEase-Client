import React, { useEffect, useState } from "react";
import {
  type MaintenanceRequest,
  MaintenanceStatus,
} from "../../features/maintenance/types/maintenance";
import { maintenanceService } from "../../features/maintenance/services/maintenance.service";
import { Plus, Wrench, AlertCircle, Clock, CheckCircle } from "lucide-react";
import DashboardLayout from "../common/DashboardLayout";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";
import type { RoleType } from "../../types/constants/role.constant";

export const TenantMaintenance: React.FC = () => {
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
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
            <Clock size={12} /> Pending
          </span>
        );
      case MaintenanceStatus.ASSIGNED:
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
            <Wrench size={12} /> Assigned
          </span>
        );
      case MaintenanceStatus.IN_PROGRESS:
        return (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium flex items-center gap-1">
            <Wrench size={12} /> In Progress
          </span>
        );
      case MaintenanceStatus.COMPLETED:
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle size={12} /> Completed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium flex items-center gap-1">
            <AlertCircle size={12} /> {status}
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
              Maintenance Requests
            </h1>
            <p className="text-gray-500 mt-1">
              Track and submit maintenance issues for your property.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            <Plus size={20} />
            New Request
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-12 text-center">
            <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              No Maintenance Requests
            </h3>
            <p className="text-gray-500">
              You haven't submitted any maintenance requests yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {req.issueTitle}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {req.propertyTitle}
                    </p>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                  {req.issueDescription}
                </p>
                <div className="text-xs text-gray-400 flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4">
                  <span>Req #{req.requestNumber}</span>
                  <span>{new Date(req.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
