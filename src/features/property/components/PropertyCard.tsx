import { MapPin, Home, Maximize2, ExternalLink, Edit, Trash2, EyeOff, MoreVertical, Heart, Eye } from "lucide-react";
import { unlistProperty, relistProperty, deleteProperty } from "../services/propertyService";
import { useWishlist } from "../hooks/useWishlist";
import { toast } from "react-hot-toast";
import type { PropertyData } from "../types/propertyTypes";

import { useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../../../config/routes";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import { RoleTypes } from "../../../types/constants/role.constant";

interface PropertyCardProps {
  property: PropertyData;
  layout: "grid" | "list";
  isSearchMode?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, layout, isSearchMode }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isSaved, toggle } = useWishlist(property.id);
  const isList = layout === "list";

  const isOwner = user?.role === RoleTypes.OWNER_USER;

  const handleDetailsClick = () => {
    const route = isSearchMode
      ? PAGE_ROUTES.PROPERTY_DETAIL.replace(":id", property.id)
      : PAGE_ROUTES.OWNER_PROPERTY_DETAIL.replace(":id", property.id);
    navigate(route);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(PAGE_ROUTES.OWNER_EDIT_PROPERTY.replace(":id", property.id));
  };

  const handleUnlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to unlist this property?")) {
      try {
        await unlistProperty(property.id);
        toast.success("Property unlisted successfully");
        window.location.reload();
      } catch {
        toast.error("Failed to unlist property");
      }
    }
  };

  const handleRelist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to list this property again?")) {
      try {
        await relistProperty(property.id);
        toast.success("Property listed successfully");
        window.location.reload();
      } catch {
        toast.error("Failed to list property");
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to PERMANENTLY delete this property?")) {
      try {
        await deleteProperty(property.id);
        toast.success("Property deleted permanently");
        window.location.reload();
      } catch {
        toast.error("Failed to delete property");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
      case "APPROVED":
      case "AVAILABLE":
        return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
      case "RENTED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      case "UNLISTED":
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
      case "PENDING_APPROVAL":
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
      case "REJECTED":
        return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      default:
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "ACTIVE" || status === "APPROVED") return "Listed";
    if (status === "PENDING_APPROVAL") return "Verification Pending";
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <div
      className={`bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group ${isList ? "flex h-48" : "flex flex-col"}`}
    >
      <div
        className={`relative overflow-hidden ${isList ? "w-72 shrink-0" : "h-56"}`}
      >
        <img
          src={
            property.photos[property.primaryPhotoIndex] ||
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
          }
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(property.status)}`}
          >
            {getStatusLabel(property.status)}
          </span>
        </div>

        {isSearchMode && !isOwner && (
          <button
            onClick={(e) => { e.stopPropagation(); toggle(); }}
            className={`absolute top-4 right-4 p-2.5 rounded-2xl shadow-lg transition-all hover:scale-110 active:scale-95 ${isSaved ? "bg-red-500 text-white" : "bg-white/80 backdrop-blur-md text-gray-600 hover:bg-white"}`}
          >
            <Heart size={20} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "animate-pulse" : ""} />
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-[color:var(--color-foreground)] truncate group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
            <MoreVertical size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
          <MapPin size={14} />
          <span className="truncate">
            {property.locationCity}, {property.locationDistrict}
          </span>
        </div>

        {property.status === "REJECTED" && property.rejectionReason && (
          <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-xl mb-4">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-tight mb-1">Rejection Reason</p>
            <p className="text-xs text-red-600 line-clamp-2">{property.rejectionReason}</p>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5 text-sm">
            <Home size={16} className="text-gray-400" />
            <span className="uppercase">{property.propertyType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Maximize2 size={16} className="text-gray-400" />
            <span>
              {property.areaSqft ? `${property.areaSqft} sqft` : "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-[color:var(--color-border)] flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-primary">
              ₹{property.monthlyRent.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 ml-1">/month</span>
          </div>

          <button
            onClick={handleDetailsClick}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-white text-primary text-sm font-bold rounded-xl transition-all group/btn"
          >
            <span>Details</span>
            <ExternalLink
              size={14}
              className="group-hover/btn:translate-x-0.5 transition-transform"
            />
          </button>
        </div>

        {!isSearchMode && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
              title="Edit Property"
            >
              <Edit size={18} />
            </button>
            {property.status === "UNLISTED" ? (
              <button
                onClick={handleRelist}
                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all"
                title="List Property"
              >
                <Eye size={18} />
              </button>
            ) : (
              <button
                onClick={handleUnlist}
                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                title="Unlist Property"
              >
                <EyeOff size={18} />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Delete Property"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
