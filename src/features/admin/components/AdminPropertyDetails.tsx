import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  CheckCircle,
  User,
  FileText,
  AlertCircle,
  Phone,
  Mail,
} from "lucide-react";
import { usePropertyDetail } from "../../property/hooks/usePropertyDetail";
import { useAdminProperties } from "../hooks/useAdminProperties";
import { PAGE_ROUTES } from "../../../config/routes";
import { LoadingOverlay } from "../../../components/common";
import { PropertyLocationMap } from "../../property/components/PropertyLocationMap";
import { AdminPropertyHeader } from "./partials/AdminPropertyHeader";
import { AdminPropertyGallery } from "./partials/AdminPropertyGallery";
import { AdminPropertySpecs } from "./partials/AdminPropertySpecs";
import { AdminPropertyModals } from "./partials/AdminPropertyModals";

const AdminPropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, loading: fetchLoading } = usePropertyDetail(id);
  const { approve, reject, loading: actionLoading } = useAdminProperties();

  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleApprove = async () => {
    if (!id) return;
    await approve(id);
    navigate(PAGE_ROUTES.ADMIN_PROPERTIES);
  };

  const handleReject = async () => {
    if (!id || !rejectionReason) return;
    await reject(id, rejectionReason);
    navigate(PAGE_ROUTES.ADMIN_PROPERTIES);
  };

  if (fetchLoading || !property) return <LoadingOverlay />;

  return (
    <div className="max-w-7xl mx-auto pb-32 animate-in fade-in duration-700">
      <AdminPropertyHeader property={property} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Visuals & Technical Data */}
        <div className="lg:col-span-8 space-y-10">
          <AdminPropertyGallery
            photos={property.photos}
            activePhotoIndex={activePhotoIndex}
            setActivePhotoIndex={setActivePhotoIndex}
            isZoomOpen={isZoomOpen}
            setIsZoomOpen={setIsZoomOpen}
          />

          <AdminPropertySpecs property={property} />

          {/* Property Description Section */}
          <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-xl p-10 space-y-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <FileText size={22} className="text-primary" /> Listing
              Description
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-lg italic">
              "{property.description}"
            </p>
          </div>

          {/* Location Map */}
          {property.latitude && property.longitude && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <MapPin size={22} className="text-primary" /> Geo-Location
                Verification
              </h3>
              <div className="rounded-xl overflow-hidden border-8 border-white dark:border-card shadow-xl h-[400px]">
                <PropertyLocationMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  isReadOnly={true}
                />
              </div>
              <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
                  Reported Address
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {property.fullAddress}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Owner & Audit Checklist */}
        <div className="lg:col-span-4 space-y-8">
          {/* Owner Identity Block */}
          <div className="bg-gray-950 rounded-xl p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8 flex items-center gap-2">
              <User size={14} /> Registered Partner
            </h4>

            <div className="flex items-center gap-5 mb-10">
              <div className="w-20 h-20 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-primary font-black text-3xl shadow-2xl">
                {property.owner?.fullName?.charAt(0) || "O"}
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight mb-1">
                  {property.owner?.fullName || "Verified Owner"}
                </p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  Identity Verified
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                  <Mail size={18} />
                </div>
                <span className="text-xs font-black truncate">
                  {property.owner?.email || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                  <Phone size={18} />
                </div>
                <span className="text-xs font-black">
                  {property.owner?.phone || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-xl p-8 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <CheckCircle size={14} className="text-primary" /> Auditor
              Checklist
            </h4>
            <div className="space-y-4">
              {[
                "Photos are clear and original",
                "Address details are specific",
                "Rent vs Deposit ratio is standard",
                "Amenities match property type",
                "Description is professional",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-lg border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & Critical Info */}
          <div className="p-8 bg-amber-500/5 rounded-xl border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle size={20} />
              <span className="font-black text-xs uppercase tracking-widest">
                Verification Advisory
              </span>
            </div>
            <p className="text-xs font-medium text-amber-900/60 dark:text-amber-500/60 leading-relaxed">
              Please ensure the monthly rent listed (₹
              {property.monthlyRent?.toLocaleString()}) is inclusive of standard
              taxes as per platform policy.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      {property.status === "PENDING_APPROVAL" && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-40">
          <div className="bg-white/80 dark:bg-card/80 backdrop-blur-2xl p-4 rounded-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-between gap-6">
            <div className="hidden md:flex items-center gap-4 pl-4 border-r border-gray-200 pr-8">
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Final Decision
                </p>
                <p className="text-xs font-black text-primary">Requires Action</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-end">
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-lg font-black text-sm"
              >
                Reject Listing
              </button>
              <button
                onClick={() => setShowApproveModal(true)}
                className="px-8 py-3 bg-primary text-white hover:scale-[1.03] active:scale-[0.97] transition-all rounded-lg font-black text-sm shadow-xl shadow-primary/25"
              >
                Approve Listing
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminPropertyModals
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        handleReject={handleReject}
        showApproveModal={showApproveModal}
        setShowApproveModal={setShowApproveModal}
        handleApprove={handleApprove}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default AdminPropertyDetails;
