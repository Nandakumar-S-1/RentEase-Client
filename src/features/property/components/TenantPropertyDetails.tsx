import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  Bed,
  Bath,
  CheckCircle2,
  Shield,
  Heart,
  Share2,
  Phone,
  Mail,
  User as UserIcon,
  Layers,
  X,
  IndianRupee,
  Star,
  Zap,
} from "lucide-react";
import { usePropertyDetail } from "../hooks/usePropertyDetail";
import { useWishlist } from "../hooks/useWishlist";
import { LoadingOverlay } from "../../../components/common";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";

import { toast } from "react-hot-toast";
import { PropertyLocationMap } from "./PropertyLocationMap";

const TenantPropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { property, loading } = usePropertyDetail(id);
  const { isSaved, toggle } = useWishlist(id || "");
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (loading || !property) return <LoadingOverlay />;

  const handleContact = () => {
    toast.success("Contacting owner feature coming soon!", { icon: "📞" });
  };

  return (
    <DashboardLayout
      role={user?.role as RoleType}
      userName={user?.fullname || "Tenant"}
    >
      <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
        {/* Modern Navigation Bar */}
        <div className="flex items-center justify-between py-6 sticky top-0 z-30 bg-[color:var(--color-background)]/80 backdrop-blur-md mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 p-2 px-4 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm text-gray-500 hover:text-primary transition-all font-black text-xs tracking-widest uppercase"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              className={`p-3 rounded-2xl shadow-sm transition-all border ${
                isSaved
                  ? "bg-red-50 text-red-500 border-red-100"
                  : "bg-white dark:bg-card text-gray-400 border-gray-100 dark:border-white/5 hover:text-red-400"
              }`}
            >
              <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button className="p-3 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm text-gray-400 hover:text-primary transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Gallery & Info (Left) */}
          <div className="lg:col-span-8 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* High-End Gallery */}
            <div className="group relative">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
                <div
                  className="md:col-span-3 rounded-[3rem] overflow-hidden shadow-2xl cursor-zoom-in group relative"
                  onClick={() => setIsZoomOpen(true)}
                >
                  <img
                    src={property.photos[activePhotoIndex]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    alt="Property Main"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Maximize2
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      size={64}
                    />
                  </div>

                  {/* Floating Badges */}
                  <div className="absolute top-8 left-8 flex flex-col gap-2">
                    <span className="px-6 py-2 bg-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                      Premium Listing
                    </span>
                    <span className="px-6 py-2 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                      Verified {property.propertyType}
                    </span>
                  </div>
                </div>

                <div className="hidden md:grid grid-rows-4 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                  {property.photos.map((img: string, i: number) => (
                    <div
                      key={i}
                      onClick={() => setActivePhotoIndex(i)}
                      className={`rounded-[1.5rem] overflow-hidden shadow-md cursor-pointer transition-all border-4 ${
                        activePhotoIndex === i
                          ? "border-primary scale-[0.98] ring-4 ring-primary/20"
                          : "border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]"
                      }`}
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt={`Gallery ${i}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Header Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-full">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-black">4.8</span>
                  <span className="text-[10px] font-bold text-amber-600/60 ml-1">
                    (24 Reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                  <Zap size={16} /> New on the market
                </div>
              </div>

              <h1 className="text-6xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                {property.title}
              </h1>

              <div className="flex items-center gap-3 text-gray-500 font-bold text-xl">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <MapPin size={24} className="text-primary" />
                </div>
                <span className="bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                  {property.fullAddress ||
                    `${property.locationCity}, ${property.locationDistrict}`}
                </span>
              </div>
            </div>

            {/* Structured Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Maximize2,
                  label: "Total Area",
                  val: `${property.areaSqft || 0} sqft`,
                  show: true,
                },
                {
                  icon: Bed,
                  label: "Bedrooms",
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
              ]
                .filter((s) => s.show)
                .map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all"
                  >
                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-4">
                      <stat.icon size={24} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      {stat.label}
                    </p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">
                      {stat.val}
                    </p>
                  </div>
                ))}
            </div>

            {/* Detailed Description */}
            <div className="p-10 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[3.5rem] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:scale-150" />
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                The Experience
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-[2.2] text-xl font-medium">
                {property.description}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="space-y-10">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                <span className="w-2 h-10 bg-primary rounded-full" />
                Living Comforts
              </h3>
              {property.amenities && property.amenities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {property.amenities.map((amenity: string) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-4 p-6 bg-white dark:bg-card border border-gray-50 dark:border-white/5 rounded-[2.5rem] group hover:border-primary/40 transition-all hover:shadow-2xl hover:shadow-primary/5"
                    >
                      <div className="p-3 bg-primary/5 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="font-black text-gray-800 dark:text-gray-200 uppercase text-[11px] tracking-widest">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200 text-center">
                  <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
                    Standard Essential Features Included
                  </p>
                </div>
              )}
            </div>

            {/* Location Section */}
            <div className="space-y-8">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                <span className="w-2 h-10 bg-primary rounded-full" />
                Neighborhood
              </h3>
              <div className="rounded-[4rem] overflow-hidden border-8 border-white dark:border-card shadow-2xl relative">
                {property.latitude && property.longitude ? (
                  <PropertyLocationMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                    isReadOnly={true}
                  />
                ) : (
                  <div className="h-[400px] bg-gray-50 flex items-center justify-center text-gray-400 font-black uppercase tracking-[0.2em] text-xs">
                    Location Mapping Coming Soon
                  </div>
                )}
                <div className="absolute bottom-10 left-10 right-10 bg-white/80 dark:bg-card/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">
                      Primary Area
                    </p>
                    <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                      {property.locationCity}, {property.locationDistrict}
                    </p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">
                      Transit Score
                    </p>
                    <p className="text-xl font-black text-emerald-500">
                      Excellent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Floating Price Card (Right) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              {/* Premium Pricing Card */}
              <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[4rem] p-10 shadow-2xl shadow-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <IndianRupee size={150} />
                </div>

                <div className="mb-12">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4">
                    Monthly Rent
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-6xl font-black text-primary tracking-tighter">
                      ₹{property.monthlyRent?.toLocaleString()}
                    </span>
                    <span className="text-gray-400 font-black text-lg pb-2">
                      /mo
                    </span>
                  </div>
                </div>

                <div className="space-y-6 mb-12">
                  {[
                    {
                      label: "Security Deposit",
                      val: `₹${property.depositAmount?.toLocaleString()}`,
                      icon: Shield,
                    },
                    {
                      label: "Maintenance",
                      val: property.maintenanceIncluded
                        ? "Included"
                        : `₹${property.maintenanceCharges?.toLocaleString()}`,
                      color: "text-emerald-500",
                    },
                    {
                      label: "Availability",
                      val: "Ready to Move",
                      color: "text-primary",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-white/5 last:border-0"
                    >
                      <span className="text-gray-500 font-bold text-sm">
                        {row.label}
                      </span>
                      <span
                        className={`font-black ${row.color || "text-gray-900 dark:text-white"}`}
                      >
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleContact}
                  className="w-full py-6 bg-primary text-white font-black rounded-[2.5rem] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-xl mb-6 group"
                >
                  <span className="flex items-center justify-center gap-3">
                    Contact Owner{" "}
                    <ArrowLeft
                      size={24}
                      className="rotate-180 group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </button>

                <div className="flex items-center justify-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 py-3 rounded-2xl">
                  <Shield size={16} />
                  Safe & Secure Transaction
                </div>
              </div>

              {/* Owner Info Card */}
              <div className="bg-gray-950 rounded-[3.5rem] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[80px]" />

                <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-8">
                  Listed By
                </h4>

                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-2xl relative">
                    <UserIcon size={36} />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h5 className="font-black text-2xl tracking-tight mb-1">
                      {property.owner?.fullName || "Verified Owner"}
                    </h5>
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
                      ID Verified Agent
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <a
                    href={`tel:${property.owner?.phone}`}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group/item"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover/item:text-primary transition-colors">
                      <Phone size={18} />
                    </div>
                    <span className="font-black tracking-wider">
                      {property.owner?.phone || "+91 9*******10"}
                    </span>
                  </a>

                  <a
                    href={`mailto:${property.owner?.email}`}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group/item"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover/item:text-primary transition-colors">
                      <Mail size={18} />
                    </div>
                    <span className="font-black truncate max-w-[200px]">
                      {property.owner?.email || "o*********@gmail.com"}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Lightbox */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-12 animate-in fade-in duration-500"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            className="absolute top-10 right-10 p-5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[210] hover:rotate-90 duration-500"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomOpen(false);
            }}
          >
            <X size={40} />
          </button>

          <div className="max-w-7xl w-full h-full relative rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-700">
            <img
              src={property.photos[activePhotoIndex]}
              className="w-full h-full object-contain"
              alt="Zoomed"
            />

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex justify-center gap-6 px-12 py-6 bg-black/50 backdrop-blur-2xl rounded-full border border-white/10">
              {property.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    activePhotoIndex === i
                      ? "bg-primary w-20 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.5)]"
                      : "bg-white/20 w-4 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TenantPropertyDetails;
