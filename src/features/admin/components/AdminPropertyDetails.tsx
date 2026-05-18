import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  XCircle,
  MapPin,
  Home as HomeIcon,
  Maximize2,
  Bed,
  Bath,
  Layers,
  IndianRupee,
  CheckCircle,
  ShieldCheck,
  User,
  X,
  History,
  FileText,
  AlertCircle,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react";
import { usePropertyDetail } from "../../property/hooks/usePropertyDetail";
import { useAdminProperties } from "../hooks/useAdminProperties";
import { PAGE_ROUTES } from "../../../config/routes";
import { LoadingOverlay } from "../../../components/common";
import { PropertyLocationMap } from "../../property/components/PropertyLocationMap";

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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return {
          bg: "bg-amber-50 dark:bg-amber-500/10",
          text: "text-amber-600",
          border: "border-amber-200 dark:border-amber-500/20",
          label: "Awaiting Verification",
        };
      case "ACTIVE":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          text: "text-emerald-600",
          border: "border-emerald-200 dark:border-emerald-500/20",
          label: "Publicly Active",
        };
      case "REJECTED":
        return {
          bg: "bg-red-50 dark:bg-red-500/10",
          text: "text-red-600",
          border: "border-red-200 dark:border-red-500/20",
          label: "Rejected Listing",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-white/10",
          text: "text-gray-600",
          border: "border-gray-200 dark:border-white/20",
          label: status,
        };
    }
  };

  const statusStyle = getStatusStyle(property.status);
  const isPending = property.status === "PENDING_APPROVAL";

  return (
    <div className="max-w-7xl mx-auto pb-32 animate-in fade-in duration-700">
      {/* Admin Navigation & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(PAGE_ROUTES.ADMIN_PROPERTIES)}
            className="p-4 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-2xl text-gray-500 hover:text-primary transition-all shadow-sm group"
          >
            <ArrowLeft
              size={22}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
              >
                {statusStyle.label}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <History size={12} /> Last Updated:{" "}
                {new Date(property.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Audit Property:{" "}
              <span className="text-gray-500 dark:text-gray-400 font-bold">
                {property.title}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-card p-2 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
          <button
            className="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
            onClick={() => window.open(`/property/${property.id}`, "_blank")}
          >
            <ExternalLink size={16} /> Preview Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Visuals & Technical Data */}
        <div className="lg:col-span-8 space-y-10">
          {/* Professional Gallery View */}
          <div className="bg-white dark:bg-card p-4 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="grid grid-cols-12 gap-4 h-[550px]">
              <div
                className="col-span-12 md:col-span-9 rounded-[2.5rem] overflow-hidden relative group cursor-zoom-in"
                onClick={() => setIsZoomOpen(true)}
              >
                <img
                  src={property.photos[activePhotoIndex]}
                  className="w-full h-full object-cover"
                  alt="Audit View"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    High Resolution Capture
                  </p>
                  <p className="font-bold">
                    Shot {activePhotoIndex + 1} of {property.photos.length}
                  </p>
                </div>
              </div>

              <div className="hidden md:flex md:col-span-3 flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
                {property.photos.map((photo: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIndex(i)}
                    className={`relative flex-shrink-0 aspect-square rounded-[1.5rem] overflow-hidden border-4 transition-all ${
                      activePhotoIndex === i
                        ? "border-primary scale-[0.98]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photo}
                      className="w-full h-full object-cover"
                      alt={`Audit Thumbnail ${i}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: HomeIcon,
                label: "Asset Type",
                val: property.propertyType,
                show: true,
              },
              {
                icon: Maximize2,
                label: "Floor Area",
                val: `${property.areaSqft || "N/A"} SQFT`,
                show: true,
              },
              {
                icon: Bed,
                label: "Configuration",
                val: `${property.bhk || 0} BHK`,
                show:
                  property.propertyType !== "LAND" &&
                  property.propertyType !== "SHOP",
              },
              {
                icon: Bath,
                label: "Bathrooms",
                val: `${property.bathrooms || 0} Bath`,
                show: property.propertyType !== "LAND",
              },
              {
                icon: Layers,
                label: "Floor Level",
                val: property.floorNumber || "G",
                show: property.propertyType !== "LAND",
              },
              {
                icon: IndianRupee,
                label: "Monthly Ask",
                val: `₹${property.monthlyRent?.toLocaleString()}`,
                show: true,
              },
            ]
              .filter((s) => s.show)
              .map((spec, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] shadow-sm"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                    <spec.icon size={20} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    {spec.label}
                  </p>
                  <p className="text-base font-black text-gray-900 dark:text-white truncate">
                    {spec.val}
                  </p>
                </div>
              ))}
          </div>

          {/* Property Description Section */}
          <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[3rem] p-10 space-y-6">
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
              <div className="rounded-[3rem] overflow-hidden border-8 border-white dark:border-card shadow-xl h-[400px]">
                <PropertyLocationMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  isReadOnly={true}
                />
              </div>
              <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between">
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
          <div className="bg-gray-950 rounded-[3rem] p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8 flex items-center gap-2">
              <User size={14} /> Registered Partner
            </h4>

            <div className="flex items-center gap-5 mb-10">
              <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center text-primary font-black text-3xl shadow-2xl">
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
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                  <Mail size={18} />
                </div>
                <span className="text-xs font-black truncate">
                  {property.owner?.email || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
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
          <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[3rem] p-8 shadow-sm">
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
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl"
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
          <div className="p-8 bg-amber-500/5 rounded-[3rem] border border-amber-500/20 space-y-4">
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
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-40">
        <div className="bg-white/80 dark:bg-card/80 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-between gap-6">
          <div className="hidden md:flex items-center gap-4 pl-4 border-r border-gray-200 pr-8">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Final Status
              </p>
              <p className="text-xs font-black text-primary">Requires Action</p>
            </div>
          </div>

          <div className="flex-1 flex gap-4">
            {(property.status === "ACTIVE" || isPending) && (
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading}
                className="flex-1 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
              >
                Reject Listing
              </button>
            )}
            {(property.status === "REJECTED" || isPending) && (
              <button
                onClick={() => setShowApproveModal(true)}
                disabled={actionLoading}
                className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} />
                Approve & Publish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-card w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/5">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-500/10 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
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
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl p-6 text-sm min-h-[160px] focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all dark:text-white"
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
                  className="flex-[2] py-5 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-600/30 active:scale-95 disabled:opacity-50"
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
          <div className="bg-white dark:bg-card w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/5 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
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
                className="flex-[2] py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-50"
              >
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Lightbox */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in duration-500"
          onClick={() => setIsZoomOpen(false)}
        >
          <button className="absolute top-10 right-10 p-5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[210]">
            <X size={40} />
          </button>
          <div className="max-w-7xl w-full h-full p-8 animate-in zoom-in-95 duration-700">
            <img
              src={property.photos[activePhotoIndex]}
              className="w-full h-full object-contain"
              alt="Zoomed Audit View"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPropertyDetails;
