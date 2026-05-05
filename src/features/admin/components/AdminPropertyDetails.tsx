import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  XCircle,
  MapPin,
  Home as HomeIcon,
  Maximize2,
  Bed,
  IndianRupee,
  CheckCircle,
  ShieldCheck,
  User,
  Calendar,
  Info,
  X,
} from "lucide-react";
import { usePropertyDetail } from "../../property/hooks/usePropertyDetail";
import { useAdminProperties } from "../hooks/useAdminProperties";
import { PAGE_ROUTES } from "../../../config/routes";
import { LoadingOverlay } from "../../../components/common";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "ACTIVE": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "REJECTED": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const isApproved = property.status === "ACTIVE";
  const isRejected = property.status === "REJECTED";
  const isPending = property.status === "PENDING_APPROVAL";

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[color:var(--color-surface)] p-6 rounded-[2.5rem] border border-[color:var(--color-border)] shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(PAGE_ROUTES.ADMIN_PROPERTIES)}
            className="p-3 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl text-gray-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(property.status)}`}>
                {property.status.replace("_", " ")}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                ID: {property.id.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-black text-[color:var(--color-foreground)] line-clamp-1">{property.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(isApproved || isPending) && (
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={actionLoading}
              className="flex-1 md:flex-none px-8 py-4 bg-red-500/10 text-red-600 border border-red-500/20 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              Reject Listing
            </button>
          )}
          {(isRejected || isPending) && (
            <button
              onClick={() => setShowApproveModal(true)}
              disabled={actionLoading}
              className="flex-1 md:flex-none px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              Approve Listing
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Gallery */}
          <div className="grid grid-cols-12 gap-4 h-[500px]">
            {/* Main Image View */}
            <div
              className="col-span-12 md:col-span-9 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[color:var(--color-surface)] relative group cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)}
            >
              <img
                src={property.photos[activePhotoIndex]}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                alt="Main"
              />
              <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl text-white text-xs font-bold border border-white/20">
                Image {activePhotoIndex + 1} of {property.photos.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="hidden md:flex md:col-span-3 flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
              {property.photos.map((photo: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIndex(i)}
                  className={`relative flex-shrink-0 aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-lg border-2 transition-all ${activePhotoIndex === i ? 'border-primary ring-4 ring-primary/20 scale-95' : 'border-[color:var(--color-surface)] opacity-70 hover:opacity-100'}`}
                >
                  <img src={photo} className="w-full h-full object-cover" alt={`Thumbnail ${i}`} />
                </button>
              ))}
              {property.photos.length === 1 && (
                <div className="flex-1 rounded-3xl bg-gray-50/50 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-[color:var(--color-border)]">
                  <p className="text-[10px] font-black text-gray-400 uppercase text-center p-4">No additional photos</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[2.5rem] p-8 lg:p-10 shadow-xl">
            <div className="space-y-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-gray-500 font-bold bg-gray-50/50 dark:bg-white/5 w-fit px-4 py-2 rounded-2xl border border-[color:var(--color-border)]">
                  <MapPin size={20} className="text-primary" />
                  <span className="text-sm font-black">{property.fullAddress || `${property.locationCity}, ${property.locationDistrict}`}</span>
                </div>
              </div>

              {/* Core Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-5 bg-[color:var(--color-card)] rounded-3xl border border-[color:var(--color-border)] space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</p>
                  <div className="flex items-center gap-2 text-[color:var(--color-foreground)] font-black">
                    <HomeIcon size={18} className="text-primary" />
                    {property.propertyType}
                  </div>
                </div>
                <div className="p-5 bg-[color:var(--color-card)] rounded-3xl border border-[color:var(--color-border)] space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Build Area</p>
                  <div className="flex items-center gap-2 text-[color:var(--color-foreground)] font-black">
                    <Maximize2 size={18} className="text-primary" />
                    {property.areaSqft || "N/A"} SQFT
                  </div>
                </div>
                <div className="p-5 bg-[color:var(--color-card)] rounded-3xl border border-[color:var(--color-border)] space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Config</p>
                  <div className="flex items-center gap-2 text-[color:var(--color-foreground)] font-black">
                    <Bed size={18} className="text-primary" />
                    {property.bhk || 0} BHK
                  </div>
                </div>
                <div className="p-5 bg-[color:var(--color-card)] rounded-3xl border border-[color:var(--color-border)] space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified</p>
                  <div className={`flex items-center gap-2 font-black ${isApproved ? 'text-green-500' : 'text-amber-500'}`}>
                    <ShieldCheck size={18} />
                    {isApproved ? 'YES' : 'PENDING'}
                  </div>
                </div>
              </div>

              {/* More Technical Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[color:var(--color-border)]">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Furnishing</p>
                  <p className="text-sm font-black text-[color:var(--color-foreground)]">{property.furnishingStatus || "Not Specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Age</p>
                  <p className="text-sm font-black text-[color:var(--color-foreground)]">{property.propertyAge || "New Build"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Facing</p>
                  <p className="text-sm font-black text-[color:var(--color-foreground)]">{property.facingDirection || "Not Specified"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-[color:var(--color-foreground)] flex items-center gap-2">
                  Description
                  <div className="h-1 w-12 bg-primary/20 rounded-full"></div>
                </h3>
                <p className="text-gray-500 leading-[1.8] text-sm lg:text-base font-medium">{property.description}</p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-[color:var(--color-border)]">
                  <h3 className="text-xl font-black text-[color:var(--color-foreground)]">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((a: string) => (
                      <span key={a} className="px-5 py-2.5 bg-primary/5 dark:bg-white/5 rounded-2xl text-xs font-black text-gray-600 dark:text-gray-400 border border-primary/10">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules & Occupancy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[color:var(--color-border)]">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[color:var(--color-foreground)]">House Rules</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-[color:var(--color-border)]">
                      <span className="text-sm font-bold text-gray-500">Pets Allowed</span>
                      <span className={`text-xs font-black uppercase ${property.petsAllowed ? 'text-green-500' : 'text-red-500'}`}>
                        {property.petsAllowed ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-[color:var(--color-border)]">
                      <span className="text-sm font-bold text-gray-500">Smoking Allowed</span>
                      <span className={`text-xs font-black uppercase ${property.smokingAllowed ? 'text-green-500' : 'text-red-500'}`}>
                        {property.smokingAllowed ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[color:var(--color-foreground)]">Occupancy</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-[color:var(--color-border)]">
                      <span className="text-sm font-bold text-gray-500">Max Occupants</span>
                      <span className="text-sm font-black text-[color:var(--color-foreground)]">
                        {property.maximumOccupants || "Not Specified"}
                      </span>
                    </div>
                    {property.preferredTenantType && property.preferredTenantType.length > 0 && (
                      <div className="p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-[color:var(--color-border)]">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Preferred Tenants</p>
                        <div className="flex flex-wrap gap-2">
                          {property.preferredTenantType.map((t: string) => (
                            <span key={t} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info (Right) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing Card */}
          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <IndianRupee size={120} />
            </div>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-2">
              <CheckCircle size={16} className="text-primary" /> Financial Overview
            </h3>
            <div className="space-y-4">
              <div className="p-6 bg-primary text-white rounded-3xl shadow-xl shadow-primary/20">
                <p className="text-xs font-bold opacity-80 mb-1 uppercase tracking-widest">Monthly Rent</p>
                <p className="text-4xl font-black">₹{property.monthlyRent?.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-5 bg-[color:var(--color-card)] rounded-2xl border border-[color:var(--color-border)]">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Security Deposit</p>
                  <p className="text-lg font-black text-[color:var(--color-foreground)]">₹{property.depositAmount?.toLocaleString() || "0"}</p>
                </div>
                <div className="flex justify-between items-center p-5 bg-[color:var(--color-card)] rounded-2xl border border-[color:var(--color-border)]">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Maintenance</p>
                  <p className="text-lg font-black text-[color:var(--color-foreground)]">₹{property.maintenanceCharges?.toLocaleString() || "0"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Info Card */}
          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[2.5rem] p-8 shadow-xl">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
              <User size={16} className="text-primary" /> Listing Owner
            </h3>
            <div className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-[color:var(--color-border)]">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">
                {property.ownerId?.slice(-2).toUpperCase() || "OW"}
              </div>
              <div>
                <p className="text-sm font-black text-[color:var(--color-foreground)]">Owner ID: {property.ownerId?.slice(-6).toUpperCase()}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Registered Partner</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                <Calendar size={14} className="text-primary" />
                <span>Submitted on {new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Auditor's Checklist */}
          <div className="p-8 bg-amber-500/5 rounded-[2.5rem] border border-amber-500/20 space-y-4 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-amber-500/10">
              <Info size={100} />
            </div>
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500">
              <Info size={20} />
              <h4 className="font-black text-sm uppercase tracking-widest">Auditor's Note</h4>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[11px] font-bold text-amber-900/70 dark:text-amber-500/70 leading-relaxed">
                <div className="w-1 h-1 bg-amber-500 rounded-full mt-1.5 shrink-0"></div>
                Verify photos for restricted content or watermarks.
              </li>
              <li className="flex items-start gap-2 text-[11px] font-bold text-amber-900/70 dark:text-amber-500/70 leading-relaxed">
                <div className="w-1 h-1 bg-amber-500 rounded-full mt-1.5 shrink-0"></div>
                Cross-check pricing with local market averages.
              </li>
              <li className="flex items-start gap-2 text-[11px] font-bold text-amber-900/70 dark:text-amber-500/70 leading-relaxed">
                <div className="w-1 h-1 bg-amber-500 rounded-full mt-1.5 shrink-0"></div>
                Ensure address matches the property type description.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[color:var(--color-surface)] w-full max-w-md rounded-[3rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200 border border-[color:var(--color-border)]">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-red-500/10 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <XCircle size={40} />
              </div>
              <h2 className="text-3xl font-black text-[color:var(--color-foreground)]">Reject Listing</h2>
              <p className="text-sm text-gray-500 font-medium">Provide a clear reason for rejecting this property.</p>
            </div>

            <div className="space-y-6">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Blurry photos, Invalid location, Incorrect price..."
                className="w-full bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-3xl p-5 text-sm min-h-[140px] focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-[color:var(--color-foreground)] placeholder:text-gray-400"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason || actionLoading}
                  className="flex-[2] py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-600/30 disabled:opacity-50 transition-all active:scale-95"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApproveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[color:var(--color-surface)] w-full max-w-md rounded-[3rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200 border border-[color:var(--color-border)]">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-primary/20">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-3xl font-black text-[color:var(--color-foreground)]">Approve Listing</h2>
              <p className="text-sm text-gray-500 font-medium">Are you sure you want to approve this property listing? It will become visible to all tenants.</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 disabled:opacity-50 transition-all active:scale-95"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Lightbox */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[210]"
            onClick={(e) => { e.stopPropagation(); setIsZoomOpen(false); }}
          >
            <X size={32} />
          </button>

          <div className="max-w-6xl w-full aspect-video relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/5 animate-in zoom-in-95 duration-500">
            <img
              src={property.photos[activePhotoIndex]}
              className="w-full h-full object-contain"
              alt="Zoomed"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPropertyDetails;
