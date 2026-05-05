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
            if (res && res.success) {
                setIsSaved(!!res.data?.isWishlisted);
            }
        } catch (err) {
            console.error("Error checking wishlist status", err);
        }
    }, [propertyId]);

    const fetchWishlist = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getMyWishlist();
            if (res && res.success) {
                setWishlistItems(Array.isArray(res.data) ? res.data : []);
            } else {
                setWishlistItems([]);
            }
        } catch (err) {
            console.error("Failed to load wishlist", err);
            toast.error("Failed to load wishlist");
            setWishlistItems([]);
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
            const newStatus = !!res.data?.isWishlisted;
            setIsSaved(newStatus);
            toast.success(newStatus ? "Saved to wishlist" : "Removed from wishlist");
            return newStatus;
        } catch (err) {
            console.error("Failed to update wishlist", err);
            toast.error("Failed to update wishlist");
            return isSaved;
        }
    };

    return { isSaved, loading, wishlistItems, toggle, fetchWishlist };
};
