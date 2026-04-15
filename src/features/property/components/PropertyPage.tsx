import React, { useState } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useProperty } from "../hooks/useProperty";
import PropertyCard from "./PropertyCard";
import PropertySkeleton from "../../../components/common/PropertySkeleton";
import { Search, Grid, List, Plus, ChevronLeft, ChevronRight, Filter, Home } from "lucide-react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";

const PropertyPage: React.FC = () => {
    const {
        properties,
        loading,
        error,
        total,
        page,
        setPage,
        status,
        setStatus,
        layout,
        setLayout
    } = useProperty();

    const { user } = useAppSelector((state: RootState) => state.auth);
    const [searchTerm, setSearchTerm] = useState("");

    const tabs = [
        { id: "ALL", label: "All Properties" },
        { id: "RENTED", label: "Rented" },
        { id: "ACTIVE", label: "Available" },
        { id: "UNLISTED", label: "Unlisted" }
    ];

    const totalPages = Math.ceil(total / 6);

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.locationCity.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role={user?.role as RoleType} userName={user?.fullname || "Owner"}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[color:var(--color-foreground)]">My Properties</h1>
                        <p className="text-gray-500">Manage all your rental properties</p>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Plus size={20} />
                        <span>Add New Property</span>
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 py-2 border-b border-[color:var(--color-border)]">
                    <div className="flex gap-2 p-1 bg-gray-100/50 dark:bg-white/5 rounded-2xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setStatus(tab.id as any);
                                    setPage(1);
                                }}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${(status || "ALL") === tab.id
                                    ? "bg-primary text-white shadow-md shadow-primary/10"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                {tab.label}
                                {(status || "ALL") === tab.id && (
                                    <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[10px]">{total}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-white/5 p-4 rounded-3xl border border-[color:var(--color-border)]">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex p-1 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-xl">
                            <button
                                onClick={() => setLayout("grid")}
                                className={`p-2 rounded-lg transition-all ${layout === "grid" ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setLayout("list")}
                                className={`p-2 rounded-lg transition-all ${layout === "list" ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                <List size={18} />
                            </button>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all">
                            <Filter size={16} />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <PropertySkeleton key={i} />)}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-red-50/20 dark:bg-red-500/5 rounded-3xl border border-red-100 dark:border-red-500/10">
                        <p className="text-red-500 font-bold mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20">Retry</button>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 dark:bg-white/5 rounded-3xl border border-dashed border-[color:var(--color-border)]">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 flex items-center justify-center rounded-2xl mb-4">
                            <Home className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-[color:var(--color-foreground)] mb-2">No properties found</h3>
                        <p className="text-gray-500 max-w-xs text-center">We couldn't find any properties matching your current criteria.</p>
                    </div>
                ) : (
                    <div className={layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {filteredProperties.map(property => (
                            <PropertyCard key={property.id} property={property} layout={layout} />
                        ))}
                    </div>
                )}

                {!loading && filteredProperties.length > 0 && (
                    <div className="flex items-center justify-between border-t border-[color:var(--color-border)] pt-6 mt-8">
                        <p className="text-sm text-gray-500 font-medium">
                            Showing <span className="text-[color:var(--color-foreground)] font-bold">{(page - 1) * 6 + 1}</span> to <span className="text-[color:var(--color-foreground)] font-bold">{Math.min(page * 6, total)}</span> of <span className="text-[color:var(--color-foreground)] font-bold">{total}</span> properties
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 border border-[color:var(--color-border)] rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i + 1
                                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                        : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 border border-[color:var(--color-border)] rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PropertyPage;
