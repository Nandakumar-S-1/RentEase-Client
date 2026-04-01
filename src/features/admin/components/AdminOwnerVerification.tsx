import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  Clock,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useOwnerVerification } from "../hooks/useOwnerVerification";
import { Button, FormMessage } from "../../../components/common";

const AdminOwnerVerification = () => {
  const {
    owners,
    isLoading,
    error,
    successMessage,
    fetchPendingOwners,
    approve,
    reject,
  } = useOwnerVerification();

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const message = successMessage || error || "";
  const isError = !!error;

  useEffect(() => {
    fetchPendingOwners();
  }, [fetchPendingOwners]);

  const handleReject = async (ownerId: string) => {
    if (rejectionReason.length < 5) return;
    await reject(ownerId, rejectionReason);
    setRejectingId(null);
    setRejectionReason("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Owner Verification
          </h1>
          <p className="text-gray-500">
            Review and verify owner identity documents.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl text-sm font-bold">
          <Clock size={18} />
          {owners.length} Pending
        </div>
      </div>

      <FormMessage message={message} isError={isError} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 uppercase text-[10px] font-black text-gray-400 tracking-wider">
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4 text-center">Document Type</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-400 text-sm"
                  >
                    Loading pending verifications...
                  </td>
                </tr>
              ) : owners.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-400 text-sm"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ShieldCheck className="h-8 w-8 text-green-400" />
                      <span>No pending verifications</span>
                    </div>
                  </td>
                </tr>
              ) : (
                owners.map((owner) => (
                  <tr
                    key={owner.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary text-white font-bold text-xs">
                          {owner.ownerId.slice(-2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            Owner #{owner.ownerId.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            ID: {owner.id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {owner.documentUrl ? (
                        <a
                          href={owner.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <FileText size={12} />
                          {owner.documentType}
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600">
                          <FileText size={12} />
                          {owner.documentType}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-yellow-50 text-yellow-600">
                        <div className="w-1 h-1 rounded-full bg-yellow-600" />
                        {owner.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {rejectingId === owner.ownerId ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Reason (min 5 chars)"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 w-40"
                          />
                          <button
                            onClick={() => handleReject(owner.ownerId)}
                            disabled={rejectionReason.length < 5 || isLoading}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectionReason("");
                            }}
                            className="p-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={() => approve(owner.ownerId)}
                            loading={isLoading}
                            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700"
                          >
                            <Check size={14} className="mr-1" />
                            Approve
                          </Button>
                          <button
                            onClick={() => setRejectingId(owner.ownerId)}
                            className="px-3 py-1 text-xs font-bold border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                          >
                            <span className="flex items-center gap-1">
                              <X size={14} />
                              Reject
                            </span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOwnerVerification;
