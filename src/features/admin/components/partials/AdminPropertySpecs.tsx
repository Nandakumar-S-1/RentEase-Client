import React from "react";
import { Home as HomeIcon, Maximize2, Bed, Bath, Layers, IndianRupee } from "lucide-react";

interface AdminPropertySpecsProps {
  property: {
    propertyType: string;
    areaSqft?: number | null;
    bhk?: number | null;
    bathrooms?: number | null;
    floorNumber?: string | null;
    monthlyRent?: number | null;
  };
}

export const AdminPropertySpecs: React.FC<AdminPropertySpecsProps> = ({
  property,
}) => {
  return (
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
            className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 p-6 rounded-xl shadow-sm"
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
  );
};
