import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  Bed,
  Bath,
  CheckCircle,
  Shield,
  Heart,
  Share2,
  Phone,
  Mail,
  User as UserIcon,
  Layers,
  X,
  PawPrint,
  Cigarette,
  Users,
  ChevronLeft,
  ChevronRight,
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
      userName={user?.fullname || "Tenant"}
    >
      <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between py-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 p-2 px-4 rounded-xl border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)] transition-colors text-sm font-medium text-[color:var(--color-muted-foreground)]"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              className={`p-2.5 rounded-xl border transition-colors ${
                isSaved
                  ? "bg-red-50 dark:bg-red-500/10 text-red-500 border-red-200 dark:border-red-500/20"
                  : "border-[color:var(--color-border)] text-[color:var(--color-muted-foreground)] hover:text-red-400"
              }`}
            >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button className="p-2.5 rounded-xl border border-[color:var(--color-border)] text-[color:var(--color-muted-foreground)] hover:text-primary transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8 animate-in fade-in duration-500">
            {/* Photo Gallery */}
            <div className="relative rounded-lg overflow-hidden bg-[color:var(--color-surface)] border border-[color:var(--color-border)] shadow-sm">
              <div
                className="relative h-[450px] cursor-pointer"
                onClick={() => setIsZoomOpen(true)}
              >
                <img
                  src={property.photos[activePhotoIndex]}
                  className="w-full h-full object-cover"
                  alt="Property"
                />
                {property.photos.length > 1 && (
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
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1.5 bg-primary/90 text-white text-xs font-semibold rounded-lg">
                    {property.propertyType}
                  </span>
                  <span className="px-3 py-1.5 bg-emerald-500/90 text-white text-xs font-semibold rounded-lg">
                    Verified
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/50 text-white text-xs font-medium rounded-lg">
                  {activePhotoIndex + 1} / {property.photos.length}
                </div>
              </div>
              {property.photos.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {property.photos.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActivePhotoIndex(i)}
                      className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
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

            {/* Title & Location */}
            <div>
              <h1 className="text-3xl font-bold text-[color:var(--color-foreground)] mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-[color:var(--color-muted-foreground)]">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm">
                  {property.fullAddress ||
                    `${property.locationCity}, ${property.locationDistrict}`}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Maximize2,
                  label: "Area",
                  val: `${property.areaSqft || "–"} sqft`,
                  show: true,
                },
                {
                  icon: Bed,
                  label: "Bedrooms",
                  val: `${property.bhk || "–"} BHK`,
                  show:
                    property.propertyType !== "LAND" &&
                    property.propertyType !== "SHOP",
                },
                {
                  icon: Bath,
                  label: "Bathrooms",
                  val: `${property.bathrooms || "–"}`,
                  show: property.propertyType !== "LAND",
                },
                {
                  icon: Layers,
                  label: "Floor",
                  val: property.floorNumber || "–",
                  show: property.propertyType !== "LAND",
                },
              ]
                .filter((s) => s.show)
                .map((stat, i) => (
                  <div
                    key={i}
                    className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 text-[color:var(--color-muted-foreground)] mb-2">
                      <stat.icon size={16} className="text-primary" />
                      <span className="text-xs font-medium">{stat.label}</span>
                    </div>
                    <p className="text-sm font-bold text-[color:var(--color-foreground)]">
                      {stat.val}
                    </p>
                  </div>
                ))}
            </div>

            {/* Description */}
            <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6 overflow-hidden">
              <h3 className="text-lg font-bold text-[color:var(--color-foreground)] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                About This Property
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
              <div className="p-4 border-t border-[color:var(--color-border)]">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  <span className="text-sm text-[color:var(--color-muted-foreground)]">
                    {property.locationCity}, {property.locationDistrict}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6 animate-in fade-in duration-500">
              {/* Pricing Card */}
              <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6 shadow-sm">
                <p className="text-xs font-medium text-[color:var(--color-muted-foreground)] uppercase tracking-wider mb-2">
                  Monthly Rent
                </p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-3xl font-bold text-primary">
                    ₹{property.monthlyRent?.toLocaleString()}
                  </span>
                  <span className="text-[color:var(--color-muted-foreground)] text-sm pb-1">
                    /month
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    {
                      label: "Security Deposit",
                      val: `₹${property.depositAmount?.toLocaleString()}`,
                    },
                    {
                      label: "Maintenance",
                      val: property.maintenanceIncluded
                        ? "Included"
                        : `₹${property.maintenanceCharges?.toLocaleString() || "0"}`,
                    },
                    {
                      label: "Furnishing",
                      val: property.furnishingStatus || "–",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 border-b border-[color:var(--color-border)] last:border-0 text-sm"
                    >
                      <span className="text-[color:var(--color-muted-foreground)]">
                        {row.label}
                      </span>
                      <span className="font-semibold text-[color:var(--color-foreground)]">
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleContact}
                  className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm mb-3"
                >
                  Contact Owner
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 font-medium">
                  <Shield size={14} />
                  <span>Safe & Secure Transaction</span>
                </div>
              </div>

              {/* Owner Info */}
              <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6">
                <h4 className="text-xs font-medium text-[color:var(--color-muted-foreground)] uppercase tracking-wider mb-4">
                  Listed By
                </h4>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-[color:var(--color-foreground)]">
                      {property.owner?.fullName || "Verified Owner"}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      ✓ Identity Verified
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {property.owner?.phone && (
                    <a
                      href={`tel:${property.owner.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[color:var(--color-secondary)]/50 hover:bg-[color:var(--color-secondary)] transition-colors text-sm"
                    >
                      <Phone size={16} className="text-primary" />
                      <span className="font-medium">
                        {property.owner.phone}
                      </span>
                    </a>
                  )}
                  {property.owner?.email && (
                    <a
                      href={`mailto:${property.owner.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[color:var(--color-secondary)]/50 hover:bg-[color:var(--color-secondary)] transition-colors text-sm"
                    >
                      <Mail size={16} className="text-primary" />
                      <span className="font-medium truncate">
                        {property.owner.email}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              alt="Zoomed"
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

export default TenantPropertyDetails;
