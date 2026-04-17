import React from "react";
import { MapPin, Home, Maximize2, MoreVertical, ExternalLink } from "lucide-react";
import type { PropertyData } from "../types/propertyTypes";

interface PropertyCardProps {
  property: PropertyData;
  layout: "grid" | "list";
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, layout }) => {
  const isList = layout === "list";

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
      case "AVAILABLE":
        return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
      case "RENTED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      case "UNLISTED":
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "ACTIVE") return "Vacant";
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <div className={`bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group ${isList ? "flex h-48" : "flex flex-col"}`}>
      <div className={`relative overflow-hidden ${isList ? "w-72 shrink-0" : "h-56"}`}>
        <img
          src={property.photos[property.primaryPhotoIndex] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(property.status)}`}>
            {getStatusLabel(property.status)}
          </span>
        </div>
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
          <span className="truncate">{property.locationCity}, {property.locationDistrict}</span>
        </div>

        <div className="flex items-center gap-4 mb-6 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5 text-sm">
            <Home size={16} className="text-gray-400" />
            <span>2 BHK</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Maximize2 size={16} className="text-gray-400" />
            <span>950 sqft</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-[color:var(--color-border)] flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-primary">₹{property.monthlyRent.toLocaleString()}</span>
            <span className="text-xs text-gray-500 ml-1">/month</span>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-white text-primary text-sm font-bold rounded-xl transition-all group/btn">
            <span>Details</span>
            <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
