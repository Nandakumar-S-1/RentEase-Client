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
  Bath,
  IndianRupee,
  Home,
  Sofa,
  PawPrint,
  Cigarette,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePropertyDetail } from "../hooks/usePropertyDetail";
import { LoadingOverlay, Modal } from "../../../components/common";
import { PAGE_ROUTES } from "../../../config/routes";
import { unlistProperty, relistProperty } from "../services/propertyService";
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

  const getStatusConfig = () => {
    switch (property.status) {
      case "PENDING_APPROVAL":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50 dark:bg-amber-500/10",
          border: "border-amber-200 dark:border-amber-500/20",
          icon: Clock,
          label: "Pending Approval",
        };
      case "ACTIVE":
      case "APPROVED":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          border: "border-emerald-200 dark:border-emerald-500/20",
          icon: CheckCircle,
          label: "Active",
        };
      case "REJECTED":
        return {
          color: "text-rose-600",
          bg: "bg-rose-50 dark:bg-rose-500/10",
          border: "border-rose-200 dark:border-rose-500/20",
          icon: XCircle,
          label: "Rejected",
        };
      case "UNLISTED":
        return {
          color: "text-gray-500",
          bg: "bg-gray-50 dark:bg-white/5",
          border: "border-gray-200 dark:border-white/10",
          icon: EyeOff,
          label: "Unlisted",
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

  const nextPhoto = () =>
    setActivePhotoIndex((i) => (i + 1) % (property.photos?.length || 1));
  const prevPhoto = () =>
    setActivePhotoIndex(
      (i) =>
        (i - 1 + (property.photos?.length || 1)) %
        (property.photos?.length || 1),
    );

  return (
    <DashboardLayout
      role={user?.role as RoleType}
      userName={user?.fullname || "User"}
    >
      <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(PAGE_ROUTES.OWNER_PROPERTIES)}
              className="p-2 rounded-xl border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[color:var(--color-foreground)]">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[color:var(--color-muted-foreground)] mt-1">
                <MapPin size={14} className="text-primary" />
                <span>
                  {property.fullAddress ||
                    `${property.locationCity}, ${property.locationDistrict}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${status.bg} ${status.color} ${status.border}`}
            >
              <status.icon size={16} />
              <span className="text-xs font-bold">{status.label}</span>
            </div>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)] transition-colors text-sm font-medium"
            >
              <Edit3 size={16} />
              Edit
            </button>
            <button
              onClick={() =>
                navigate(`/owner/properties/${property.id}/service-providers`)
              }
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)] transition-colors text-sm font-medium"
            >
              <Wrench size={16} />
              Services
            </button>
          </div>
        </div>

        {/* Rejection Alert */}
        {property.status === "REJECTED" && (
          <div className="mb-8 p-5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg flex items-start gap-4">
            <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-rose-700 dark:text-rose-400 text-sm mb-1">
                Listing Rejected
              </p>
              <p className="text-rose-600/80 dark:text-rose-300/60 text-sm">
                {property.rejectionReason ||
                  "Please update your listing and resubmit for review."}
              </p>
            </div>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors whitespace-nowrap"
            >
              Fix & Resubmit
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Photo Gallery */}
            <div className="relative rounded-lg overflow-hidden bg-[color:var(--color-surface)] border border-[color:var(--color-border)] shadow-sm">
              <div
                className="relative h-[400px] cursor-pointer"
                onClick={() => setIsZoomOpen(true)}
              >
                <img
                  src={property.photos?.[activePhotoIndex] || ""}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {property.photos && property.photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevPhoto();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextPhoto();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/50 text-white text-xs font-medium rounded-lg">
                  {activePhotoIndex + 1} / {property.photos?.length || 0}
                </div>
              </div>
              {property.photos && property.photos.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {property.photos.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActivePhotoIndex(i)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activePhotoIndex === i
                          ? "border-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt={`Photo ${i + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Area",
                  val: `${property.areaSqft || "–"} sqft`,
                  icon: Maximize2,
                  show: true,
                },
                {
                  label: "BHK",
                  val: `${property.bhk || "–"} BHK`,
                  icon: Bed,
                  show:
                    property.propertyType !== "LAND" &&
                    property.propertyType !== "SHOP",
                },
                {
                  label: "Bathrooms",
                  val: `${property.bathrooms || "–"}`,
                  icon: Bath,
                  show: property.propertyType !== "LAND",
                },
                {
                  label: "Floor",
                  val: property.floorNumber || "–",
                  icon: Layers,
                  show: property.propertyType !== "LAND",
                },
                {
                  label: "Monthly Rent",
                  val: `₹${property.monthlyRent?.toLocaleString() || "–"}`,
                  icon: IndianRupee,
                  show: true,
                },
                {
                  label: "Deposit",
                  val: `₹${property.depositAmount?.toLocaleString() || "–"}`,
                  icon: TrendingUp,
                  show: true,
                },
                {
                  label: "Type",
                  val: property.propertyType || "–",
                  icon: Home,
                  show: true,
                },
                {
                  label: "Furnishing",
                  val: property.furnishingStatus || "–",
                  icon: Sofa,
                  show: !!property.furnishingStatus,
                },
              ]
                .filter((s) => s.show)
                .map((item, i) => (
                  <div
                    key={i}
                    className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 text-[color:var(--color-muted-foreground)] mb-2">
                      <item.icon size={16} className="text-primary" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    <p className="text-sm font-bold text-[color:var(--color-foreground)] truncate">
                      {item.val}
                    </p>
                  </div>
                ))}
            </div>

            {/* Description */}
            <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6 overflow-hidden">
              <h3 className="text-lg font-bold text-[color:var(--color-foreground)] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                Description
              </h3>
              <p
                className="text-[color:var(--color-muted-foreground)] leading-relaxed"
                style={{ overflowWrap: "anywhere" }}
              >
                {property.description}
              </p>
            </div>

            {/* Property Rules */}
            {property.propertyType !== "LAND" && (
              <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[color:var(--color-foreground)] mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  Property Rules
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[color:var(--color-secondary)]/50">
                    <PawPrint
                      size={18}
                      className={
                        property.petsAllowed
                          ? "text-emerald-500"
                          : "text-[color:var(--color-muted-foreground)]"
                      }
                    />
                    <div>
                      <p className="text-xs text-[color:var(--color-muted-foreground)]">
                        Pets
                      </p>
                      <p className="text-sm font-semibold">
                        {property.petsAllowed ? "Allowed" : "Not Allowed"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[color:var(--color-secondary)]/50">
                    <Cigarette
                      size={18}
                      className={
                        property.smokingAllowed
                          ? "text-emerald-500"
                          : "text-[color:var(--color-muted-foreground)]"
                      }
                    />
                    <div>
                      <p className="text-xs text-[color:var(--color-muted-foreground)]">
                        Smoking
                      </p>
                      <p className="text-sm font-semibold">
                        {property.smokingAllowed ? "Allowed" : "Not Allowed"}
                      </p>
                    </div>
                  </div>
                  {property.propertyType !== "SHOP" &&
                    property.maximumOccupants && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[color:var(--color-secondary)]/50">
                        <Users size={18} className="text-primary" />
                        <div>
                          <p className="text-xs text-[color:var(--color-muted-foreground)]">
                            Max Occupants
                          </p>
                          <p className="text-sm font-semibold">
                            {property.maximumOccupants}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[color:var(--color-foreground)] mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity: string) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[color:var(--color-secondary)]/50"
                    >
                      <CheckCircle
                        size={16}
                        className="text-emerald-500 shrink-0"
                      />
                      <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg overflow-hidden">
              <div className="p-6 pb-0">
                <h3 className="text-lg font-bold text-[color:var(--color-foreground)] mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  Location
                </h3>
              </div>
              <div className="h-[300px]">
                {property.latitude && property.longitude ? (
                  <PropertyLocationMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                    isReadOnly={true}
                  />
                ) : (
                  <div className="w-full h-full bg-[color:var(--color-secondary)] flex items-center justify-center text-[color:var(--color-muted-foreground)] text-sm">
                    Location not available
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-[color:var(--color-border)] flex items-center gap-2 text-sm text-[color:var(--color-muted-foreground)]">
                <MapPin size={14} className="text-primary" />
                {property.fullAddress}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Engagement Metrics */}
              <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6">
                <h4 className="text-xs font-bold text-[color:var(--color-muted-foreground)] uppercase tracking-wider mb-4">
                  Engagement
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-[color:var(--color-secondary)]/50">
                    <Eye size={20} className="mx-auto text-primary mb-2" />
                    <p className="text-2xl font-bold text-[color:var(--color-foreground)]">
                      {property.viewsCount || 0}
                    </p>
                    <p className="text-xs text-[color:var(--color-muted-foreground)]">
                      Views
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-[color:var(--color-secondary)]/50">
                    <Heart size={20} className="mx-auto text-rose-500 mb-2" />
                    <p className="text-2xl font-bold text-[color:var(--color-foreground)]">
                      {property.wishlistCount || 0}
                    </p>
                    <p className="text-xs text-[color:var(--color-muted-foreground)]">
                      Wishlisted
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6 space-y-3">
                <h4 className="text-xs font-bold text-[color:var(--color-muted-foreground)] uppercase tracking-wider mb-4">
                  Quick Actions
                </h4>
                {property.status === "ACTIVE" && (
                  <button
                    onClick={() => setIsUnlistModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-xl text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                  >
                    <EyeOff size={16} />
                    Unlist Property
                  </button>
                )}
                {property.status === "UNLISTED" && (
                  <button
                    onClick={() => setIsRelistModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                  >
                    <Eye size={16} />
                    Relist Property
                  </button>
                )}
              </div>

              {/* Listing Info */}
              <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6">
                <h4 className="text-xs font-bold text-[color:var(--color-muted-foreground)] uppercase tracking-wider mb-4">
                  Listing Info
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[color:var(--color-muted-foreground)]">
                      Listed
                    </span>
                    <span className="font-medium text-[color:var(--color-foreground)]">
                      {new Date(property.createdAt).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[color:var(--color-muted-foreground)]">
                      Last Updated
                    </span>
                    <span className="font-medium text-[color:var(--color-foreground)]">
                      {new Date(property.updatedAt).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </span>
                  </div>
                  {property.nearbyLandmarks && (
                    <div className="flex justify-between items-start text-sm">
                      <span className="text-[color:var(--color-muted-foreground)] shrink-0">
                        Landmarks
                      </span>
                      <span className="font-medium text-[color:var(--color-foreground)] text-right ml-4">
                        {property.nearbyLandmarks}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Badge */}
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <span className="text-sm font-bold">Platform Verified</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  This listing is protected by RentEase platform policies and
                  verified ownership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isUnlistModalOpen}
        onClose={() => setIsUnlistModalOpen(false)}
        onConfirm={handleUnlist}
        title="Unlist Property?"
        description="This will temporarily hide your property from the public listings. You can relist it anytime."
        confirmText="Yes, Unlist"
        isDestructive={false}
      />
      <Modal
        isOpen={isRelistModalOpen}
        onClose={() => setIsRelistModalOpen(false)}
        onConfirm={handleRelist}
        title="Relist Property?"
        description="Your property will become visible to potential tenants again."
        confirmText="Go Live"
        isDestructive={false}
      />

      {/* Lightbox */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[210]"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomOpen(false);
            }}
          >
            <X size={24} />
          </button>
          <div className="max-w-5xl w-full h-full flex items-center justify-center">
            <img
              src={property.photos[activePhotoIndex]}
              className="max-w-full max-h-full object-contain rounded-lg"
              alt="Full Preview"
            />
          </div>
          {property.photos.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full">
              {property.photos.map((_: string, i: number) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIndex(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activePhotoIndex === i
                      ? "bg-primary w-6"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default OwnerPropertyDetails;
