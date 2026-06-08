import React from "react";
import { XCircle, ShieldCheck } from "lucide-react";

interface AdminPropertyModalsProps {
  showRejectModal: boolean;
  setShowRejectModal: (show: boolean) => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  handleReject: () => void;
  showApproveModal: boolean;
  setShowApproveModal: (show: boolean) => void;
  handleApprove: () => void;
  actionLoading: boolean;
}

export const AdminPropertyModals: React.FC<AdminPropertyModalsProps> = ({
  showRejectModal,
  setShowRejectModal,
  rejectionReason,
  setRejectionReason,
  handleReject,
  showApproveModal,
  setShowApproveModal,
  handleApprove,
  actionLoading,
}) => {
  return (
    <>
      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-card w-full max-w-md rounded-xl p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/5">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-500/10 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <XCircle size={48} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                Reject Listing
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                Please specify the reason for rejection.
              </p>
            </div>

            <div className="space-y-6">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Photos are blurry or contain watermarks..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-6 text-sm min-h-[160px] focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all dark:text-white"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 font-black text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason || actionLoading}
                  className="flex-[2] py-5 bg-red-600 text-white font-black rounded-lg shadow-xl shadow-red-600/30 active:scale-95 disabled:opacity-50"
                >
                  Submit Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-card w-full max-w-md rounded-xl p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/5 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Approve Property
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-10">
              This property will be instantly published and visible to all
              platform tenants. Confirm audit completion?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 font-black text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-[2] py-5 bg-primary text-white font-black rounded-lg shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-50"
              >
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
