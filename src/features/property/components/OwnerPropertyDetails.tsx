import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Clock,
  MapPin,
  Maximize2,
  Layers,
  Bed,
  EyeOff,
  Wrench,
  Heart,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  X,
  ShieldCheck,
  ChevronRight,
  Zap,
  Bath,
} from "lucide-react";
import { usePropertyDetail } from "../hooks/usePropertyDetail";
import { LoadingOverlay, Modal } from "../../../components/common";
import { PAGE_ROUTES } from "../../../config/routes";
import {
  unlistProperty,
  relistProperty,
} from "../services/propertyService";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { PropertyLocationMap } from "./PropertyLocationMap";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";

const OwnerPropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { property, loading } = usePropertyDetail(id);

  const [isUnlistModalOpen, setIsUnlistModalOpen] = React.useState(false);
  const [isRelistModalOpen, setIsRelistModalOpen] = React.useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = React.useState(0);
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);

  if (loading || !property) return <LoadingOverlay />;

  const handleEdit = () => {
    navigate(PAGE_ROUTES.OWNER_EDIT_PROPERTY.replace(":id", property.id));
  };

  const handleUnlist = async () => {
    try {
      await unlistProperty(property.id);
      toast.success("Property unlisted successfully");
      navigate(PAGE_ROUTES.OWNER_PROPERTIES);
    } catch (err) {
      console.error("Failed to unlist property:", err);
      toast.error("Failed to unlist property");
    }
  };

  const handleRelist = async () => {
    try {
      await relistProperty(property.id);
      toast.success("Property listed successfully");
      navigate(PAGE_ROUTES.OWNER_PROPERTIES);
    } catch (err) {
      console.error("Failed to relist property:", err);
      toast.error("Failed to relist property");
    }
  };

  // const handleDelete = async () => {
  //   try {
  //     await deleteProperty(property.id);
  //     toast.success("Property deleted permanently");
  //     navigate(PAGE_ROUTES.OWNER_PROPERTIES);
  //   } catch (err) {
  //     console.error("Failed to delete property:", err);
  //     toast.error("Failed to delete property");
  //   }
  // };

  const getStatusConfig = () => {
    switch (property.status) {
      case "PENDING_APPROVAL":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50 dark:bg-amber-500/10",
          border: "border-amber-200 dark:border-amber-500/20",
          icon: Clock,
          label: "In Audit Phase",
        };
      case "ACTIVE":
      case "APPROVED":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          border: "border-emerald-200 dark:border-emerald-500/20",
          icon: CheckCircle,
          label: "Live & Booking",
        };
      case "REJECTED":
        return {
          color: "text-rose-600",
          bg: "bg-rose-50 dark:bg-rose-500/10",
          border: "border-rose-200 dark:border-rose-500/20",
          icon: XCircle,
          label: "Rejected Listing",
        };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-50 dark:bg-white/10",
          border: "border-gray-200 dark:border-white/20",
          icon: AlertCircle,
          label: property.status,
        };
    }
  };

  const status = getStatusConfig();

  return (
    <DashboardLayout
      role={user?.role as RoleType}
      userName={user?.fullname || "User"}
    >
      <div className="pb-20 animate-in fade-in duration-1000">
        {/* Modern Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <button
              onClick={() => navigate(PAGE_ROUTES.OWNER_PROPERTIES)}
              className="flex items-center gap-2 p-2 px-4 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-2xl text-[10px] font-black text-gray-400 tracking-widest uppercase hover:text-primary transition-all shadow-sm"
            >
              <ArrowLeft size={14} /> Back to Portfolio
            </button>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              Property <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg max-w-xl">
              Insights and management tools for {property.title}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-card p-3 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-6 py-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              <Edit3 size={16} /> Edit Details
            </button>
            <button
              onClick={() =>
                navigate(`/owner/properties/${property.id}/service-providers`)
              }
              className="flex items-center gap-2 px-6 py-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              <Wrench size={16} /> Service Partners
            </button>

            <div className="h-10 w-[1px] bg-gray-100 dark:bg-white/5 mx-2" />

            {property.status === "UNLISTED" && (
              <button
                onClick={() => setIsRelistModalOpen(true)}
                className="flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all"
              >
                <Eye size={16} /> Relist Property
              </button>
            )}
            {property.status === "ACTIVE" && (
              <button
                onClick={() => setIsUnlistModalOpen(true)}
                className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all"
              >
                <EyeOff size={16} /> Unlist Listing
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Dashboard Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Visual Hero Banner */}
            <div className="relative group rounded-[4rem] overflow-hidden shadow-2xl h-[450px]">
              <img
                src={property.photos?.[activePhotoIndex] || ""}
                alt="Main"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />

              {/* Corner Status Badge */}
              <div className="absolute top-10 left-10">
                <div
                  className={`px-6 py-3 rounded-2xl backdrop-blur-xl border-2 flex items-center gap-3 ${status.bg} ${status.color} ${status.border} shadow-2xl`}
                >
                  <status.icon size={18} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Header Overlay */}
              <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between">
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tight mb-2">
                    {property.title}
                  </h2>
                  <div className="flex items-center gap-3 text-white/70 font-bold">
                    <MapPin size={20} className="text-primary" />
                    {property.fullAddress}
                  </div>
                </div>
                <div className="hidden md:flex gap-2">
                  {property.photos?.slice(0, 3).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhotoIndex(i)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${activePhotoIndex === i ? "border-primary scale-110 shadow-xl" : "border-white/20 opacity-60"}`}
                    >
                      <img
                        src={property.photos[i]}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Critical Alerts (Rejection Reason) */}
            {property.status === "REJECTED" && (
              <div className="p-8 bg-rose-500/10 dark:bg-rose-500/5 rounded-[3rem] border-2 border-rose-500/20 animate-in bounce-in duration-700">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-rose-500/20 rounded-[1.5rem] flex items-center justify-center text-rose-600 shrink-0">
                    <AlertCircle size={32} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-rose-600 font-black text-xs uppercase tracking-widest mb-1">
                        Feedback from Audit Team
                      </h4>
                      <p className="text-gray-600 dark:text-rose-200/60 font-medium text-lg leading-relaxed">
                        "
                        {property.rejectionReason ||
                          "Listing requires verification of address and photo quality."}
                        "
                      </p>
                    </div>
                    <button
                      onClick={handleEdit}
                      className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:scale-[1.02] transition-all"
                    >
                      Fix Requirements Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Spec Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Build Area",
                  val: `${property.areaSqft || 0} SQFT`,
                  icon: Maximize2,
                  color: "text-emerald-500",
                  show: true,
                },
                {
                  label: "Asset Level",
                  val: `${property.bhk || 0} BHK`,
                  icon: Bed,
                  color: "text-blue-500",
                  show:
                    property.propertyType !== "LAND" &&
                    property.propertyType !== "SHOP",
                },
                {
                  label: "Bathrooms",
                  val: `${property.bathrooms || 0} Bath`,
                  icon: Bath,
                  color: "text-rose-500",
                  show: property.propertyType !== "LAND",
                },
                {
                  label: "Floor Level",
                  val: property.floorNumber || "G",
                  icon: Layers,
                  color: "text-amber-500",
                  show: property.propertyType !== "LAND",
                },
                {
                  label: "Monthly Ask",
                  val: `₹${property.monthlyRent?.toLocaleString()}`,
                  icon: TrendingUp,
                  color: "text-primary",
                  show: true,
                },
              ]
                .filter((s) => s.show)
                .map((item, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all"
                  >
                    <div
                      className={`w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center ${item.color} mb-4`}
                    >
                      <item.icon size={22} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    <p className="text-base font-black text-gray-900 dark:text-white truncate">
                      {item.val}
                    </p>
                  </div>
                ))}
            </div>

            {/* Description Card */}
            <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                Market Description
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-[2.1] text-xl font-medium italic">
                "{property.description}"
              </p>
            </div>

            {/* Map Preview */}
            <div className="space-y-6">
              <h3 className="text-xl font-black flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                Location Profile
              </h3>
              <div className="rounded-[4rem] overflow-hidden border-8 border-white dark:border-card shadow-2xl h-[400px] relative">
                {property.latitude && property.longitude ? (
                  <PropertyLocationMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                    isReadOnly={true}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 font-black uppercase tracking-widest text-xs">
                    Geo-profile not generated
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats & Insights Sidebar */}
          <div className="lg:col-span-4 space-y-8 relative">
            <div className="sticky top-28 space-y-8 animate-in slide-in-from-right-8 duration-1000">
              {/* Performance Metrics */}
              <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[3.5rem] p-10 shadow-2xl shadow-primary/5 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                  <Zap size={14} className="text-primary" /> Live Engagement
                </h3>

                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Eye size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Profile Visits
                      </p>
                      <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        {property.viewsCount || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-[1.5rem] flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                      <Heart size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Saved by Tenants
                      </p>
                      <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        {property.wishlistCount || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-50 dark:border-white/5">
                  <div className="flex items-center justify-between group/link cursor-pointer">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">
                      Advanced Analytics
                    </span>
                    <ChevronRight
                      size={20}
                      className="text-primary group-hover/link:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Trust Summary */}
              <div className="bg-gray-950 rounded-[3rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck size={100} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">
                  Listing Security
                </h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
                    <CheckCircle size={20} />
                  </div>
                  <span className="text-sm font-bold">Ownership Verified</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-sm font-bold">Platform Protected</span>
                </div>
              </div>

              {/* Quick Info Bar */}
              <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold">
                    Listing Created
                  </span>
                  <span className="font-black text-gray-800 dark:text-white">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold">Last Edited</span>
                  <span className="font-black text-gray-800 dark:text-white">
                    {new Date(property.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Interaction Modals */}
      <Modal
        isOpen={isUnlistModalOpen}
        onClose={() => setIsUnlistModalOpen(false)}
        onConfirm={handleUnlist}
        title="Pause Listing?"
        description="This will temporarily hide your property from the public market. You can relist it anytime."
        confirmText="Yes, Unlist"
        isDestructive={false}
      />

      <Modal
        isOpen={isRelistModalOpen}
        onClose={() => setIsRelistModalOpen(false)}
        onConfirm={handleRelist}
        title="Resume Listing?"
        description="Your property will instantly become visible to thousands of potential tenants again."
        confirmText="Go Live Now"
        isDestructive={false}
      />

      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in duration-500"
          onClick={() => setIsZoomOpen(false)}
        >
          <button className="absolute top-10 right-10 p-5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[210] hover:rotate-90 duration-500">
            <X size={40} />
          </button>
          <div className="max-w-7xl w-full h-full p-12 animate-in zoom-in-95 duration-700">
            <img
              src={property.photos[activePhotoIndex]}
              className="w-full h-full object-contain"
              alt="Full Preview"
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OwnerPropertyDetails;
