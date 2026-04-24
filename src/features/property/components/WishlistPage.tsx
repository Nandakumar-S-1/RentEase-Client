import React, { useEffect } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import { useWishlist } from "../hooks/useWishlist";
import PropertyCard from "./PropertyCard";
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
        <DashboardLayout role={user?.role as RoleType} userName={user?.fullname || "User"}>
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight flex items-center gap-4">
                        Saved Properties
                        <Heart className="text-red-500 fill-red-500" size={32} />
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide">
                        Check out the homes you've saved for later.
                    </p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-white dark:bg-card rounded-3xl shadow-sm flex items-center justify-center mb-6 text-gray-300">
                            <Heart size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 font-medium mb-8 text-center max-w-md">
                            Browse properties and click the heart icon to save them here for quick access.
                        </p>
                        <button 
                            onClick={() => navigate(PAGE_ROUTES.SEARCH_PROPERTIES)}
                            className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 transition-all"
                        >
                            <Search size={20} />
                            Start Browsing
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistItems.map((item) => (
                            <PropertyCard 
                                key={item.id} 
                                property={item} 
                                layout="grid" 
                                isSearchMode={true} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default WishlistPage;
