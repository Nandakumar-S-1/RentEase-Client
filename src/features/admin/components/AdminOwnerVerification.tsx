import { useEffect, useState } from "react";
import {
  Check,
  X,
  Clock,
  FileText,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useOwnerVerification } from "../hooks/useOwnerVerification";
import { type PendingOwner } from "../services/adminVerificationService";
import { Button, FormMessage, Table } from "../../../components/common";

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[2.5rem] p-10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight flex items-center gap-4">
              Pending Verifications
              <ShieldCheck className="text-primary/40" size={32} />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              Review and verify property owner identity documents.
            </p>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-2xl text-sm font-black uppercase tracking-widest">
            <Clock size={18} />
            {owners.length} Pending
          </div>
        </div>

        <FormMessage message={message} isError={isError} />

        <div className="bg-[color:var(--color-background)] rounded-3xl border border-[color:var(--color-border)] overflow-hidden">
          <Table<PendingOwner>
            columns={[
              {
                header: "Owner",
                key: "owner",
                render: (owner: PendingOwner) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-primary/10 text-primary font-black text-xs">
                      {owner.ownerId.slice(-2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[color:var(--color-foreground)]">
                        Owner #{owner.ownerId.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        UUID: {owner.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                header: "Document Type",
                key: "documentType",
                render: (owner) =>
                  owner.documentUrl ? (
                    <div className="text-center">
                      <a
                        href={owner.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-all cursor-pointer"
                      >
                        <FileText size={14} />
                        {owner.documentType}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-500">
                        {owner.documentType}
                      </span>
                    </div>
                  ),
              },
              {
                header: "Status",
                key: "status",
                render: (owner) => (
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                      {owner.status}
                    </span>
                  </div>
                ),
              },
              {
                header: "Actions",
                key: "actions",
                render: (owner) => (
                  <div className="px-6 py-4 flex items-center justify-center gap-3">
                    {rejectingId === owner.ownerId ? (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                        <input
                          type="text"
                          placeholder="Reason..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="px-4 py-2 text-xs border border-[color:var(--color-border)] rounded-xl focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/20 w-48 bg-[color:var(--color-surface)] font-bold"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(owner.ownerId);
                          }}
                          disabled={rejectionReason.length < 5 || isLoading}
                          className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg shadow-red-600/20"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRejectingId(null);
                            setRejectionReason("");
                          }}
                          className="p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-all font-black"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            approve(owner.ownerId);
                          }}
                          loading={isLoading}
                          className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                        >
                          Approve
                        </Button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRejectingId(owner.ownerId);
                          }}
                          className="px-6 py-2 text-xs font-black uppercase tracking-widest border border-red-200 text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
            data={owners}
            isLoading={isLoading}
            emptyMessage="No pending verifications"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOwnerVerification;
