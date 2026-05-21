import React, { useEffect } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import { useWishlist } from "../hooks/useWishlist";
import PropertyCard from "./partials/PropertyCard";
import { LoadingOverlay } from "../../../components/common";
import { Heart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../../../config/routes";

const WishlistPage: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { wishlistItems, loading, fetchWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (loading && wishlistItems.length === 0) return <LoadingOverlay />;

  return (
    <DashboardLayout
      role={user?.role as RoleType}
      userName={user?.fullname || "User"}
    >
      <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight flex items-center gap-4">
            Saved Properties
            <div className="p-3 bg-red-500/10 rounded-2xl">
              <Heart className="text-red-500 fill-red-500" size={28} />
            </div>
          </h1>
          <p className="text-gray-500 font-medium tracking-wide">
            Check out the homes you've saved for later.
          </p>
        </div>

        {!wishlistItems || wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-[color:var(--color-surface)] dark:bg-white/5 rounded-[3.5rem] border-2 border-dashed border-[color:var(--color-border)] shadow-inner">
            <div className="w-24 h-24 bg-[color:var(--color-card)] rounded-[2rem] shadow-xl flex items-center justify-center mb-8 text-gray-300 border border-[color:var(--color-border)]">
              <Heart size={48} className="text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-[color:var(--color-foreground)] mb-3">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 font-medium mb-10 text-center max-w-sm leading-relaxed">
              Browse properties and click the heart icon to save them here for
              quick access.
            </p>
            <button
              onClick={() => navigate(PAGE_ROUTES.SEARCH_PROPERTIES)}
              className="flex items-center gap-3 px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Search size={20} />
              Start Browsing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.filter(Boolean).map((item) => (
              <PropertyCard
                key={item.id}
                property={item}
                layout="grid"
                isSearchMode={true}
                onToggleWishlist={fetchWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WishlistPage;
