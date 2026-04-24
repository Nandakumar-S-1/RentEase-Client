import { useState, useCallback, useEffect } from "react";
import { toggleWishlist as toggleWishlistApi, checkWishlisted, getMyWishlist } from "../services/wishlistService";
import { toast } from "react-hot-toast";
import type { PropertyData } from "../types/propertyTypes";

export const useWishlist = (propertyId?: string) => {
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [wishlistItems, setWishlistItems] = useState<PropertyData[]>([]);

    const fetchStatus = useCallback(async () => {
        if (!propertyId) return;
        try {
            const res = await checkWishlisted(propertyId);
            setIsSaved(res.data.isWishlisted);
        } catch (err) {
            console.error("Error checking wishlist status", err);
        }
    }, [propertyId]);

    const fetchWishlist = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getMyWishlist();
            setWishlistItems(res.data);
        } catch {
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (propertyId) fetchStatus();
    }, [propertyId, fetchStatus]);

    const toggle = async () => {
        if (!propertyId) return;
        try {
            const res = await toggleWishlistApi(propertyId);
            setIsSaved(res.data.isWishlisted);
            toast.success(res.data.isWishlisted ? "Saved to wishlist" : "Removed from wishlist");
        } catch {
            toast.error("Failed to update wishlist");
        }
    };

    return { isSaved, loading, wishlistItems, toggle, fetchWishlist };
};
