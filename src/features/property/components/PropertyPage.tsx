import React, { useState } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useProperty } from "../hooks/useProperty";
import PropertyCard from "./PropertyCard";
import PropertySkeleton from "../../../components/common/PropertySkeleton";
import {
  Search,
  Grid,
  List,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Home,
  MapPin,
  Building,
  RotateCcw,
} from "lucide-react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import { useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../../../config/routes";
import { useLocation } from "react-router-dom";
import { PropertyStatus } from "../../../types/constants/property.constant";
import { propertyFilterSchema } from "../schemas/propertySchemas";

const PropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchMode = location.pathname === PAGE_ROUTES.SEARCH_PROPERTIES;

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
    setLayout,
    filters,
    setFilters,
  } = useProperty(isSearchMode ? "search" : "owner");

  const { user } = useAppSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const tabs = [
    { id: "ALL", label: "All Properties" },
    { id: PropertyStatus.PENDING_APPROVAL, label: "Pending" },
    { id: PropertyStatus.ACTIVE, label: "Available" },
    { id: PropertyStatus.UNLISTED, label: "Unlisted" },
    { id: PropertyStatus.REJECTED, label: "Rejected" },
  ];

  const totalPages = Math.ceil(total / 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = propertyFilterSchema.safeParse({ query: searchTerm });
    if (result.success) {
      setFilters((prev) => ({ ...prev, query: searchTerm }));
      setPage(1);
    }
  };

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    const result = propertyFilterSchema.safeParse(newFilters);
    if (result.success) {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPage(1);
    }
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
    setPage(1);
  };

  const showBhkFilter =
    !filters.propertyType ||
    ["FLAT", "HOUSE", "PG"].includes(filters.propertyType);
  const showAreaFilter =
    !filters.propertyType ||
    ["LAND", "SHOP", "HOUSE", "FLAT"].includes(filters.propertyType);

  return (
    <DashboardLayout
      role={user?.role as RoleType}
      userName={user?.fullname || "User"}
    >
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight">
              {isSearchMode ? "Find Your Home" : "My Properties"}
            </h1>
            <p className="text-gray-500 font-medium">
              {isSearchMode
                ? "Discover premium rental properties across Kerala"
                : "Manage and monitor your property listings"}
            </p>
          </div>

          {!isSearchMode && (
            <button
              onClick={() => navigate(PAGE_ROUTES.OWNER_ADD_PROPERTY)}
              className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus size={22} />
              <span>Add New Property</span>
            </button>
          )}
        </div>

        {/* Status Tabs - Only for Owners */}
        {!isSearchMode && (
          <div className="flex flex-wrap items-center gap-4 py-2 border-b border-[color:var(--color-border)]">
            <div className="flex gap-2 p-1.5 bg-gray-100/50 dark:bg-white/5 rounded-2xl border border-[color:var(--color-border)]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setStatus(tab.id === "ALL" ? undefined : tab.id);
                    setPage(1);
                  }}
                  className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                    (status || "ALL") === tab.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                  {(status || "ALL") === tab.id && (
                    <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">
                      {total}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-[color:var(--color-surface)] p-5 rounded-[2.5rem] border border-[color:var(--color-border)] shadow-xl">
            <div className="relative w-full lg:max-w-xl">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, place or keywords..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Optional: Real-time search if preferred, or just rely on the button
                }}
                className="w-full pl-12 pr-4 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleSearch(e as unknown as React.FormEvent)
                }
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters((prev) => ({ ...prev, query: "" }));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <button
                onClick={handleSearch}
                className="px-8 py-3.5 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm"
              >
                Search Now
              </button>
              <div className="flex p-1.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl">
                <button
                  type="button"
                  onClick={() => setLayout("grid")}
                  className={`p-2.5 rounded-xl transition-all ${layout === "grid" ? "bg-primary text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout("list")}
                  className={`p-2.5 rounded-xl transition-all ${layout === "list" ? "bg-primary text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <List size={20} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3.5 border rounded-2xl text-sm font-black transition-all ${showFilters ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-[color:var(--color-card)] border-[color:var(--color-border)] text-gray-600 dark:text-gray-400 hover:bg-gray-100/50"}`}
              >
                <Filter size={18} />
                <span>Filters</span>
                {Object.keys(filters).length > (filters.query ? 1 : 0) && (
                  <span className="ml-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="p-8 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[3rem] shadow-2xl animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    <MapPin size={14} className="text-primary" /> City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kochi"
                    className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    onChange={(e) =>
                      handleFilterChange({ city: e.target.value })
                    }
                    value={filters.city || ""}
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    <Building size={14} className="text-primary" /> Property
                    Type
                  </label>
                  <select
                    className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    onChange={(e) =>
                      handleFilterChange({ propertyType: e.target.value })
                    }
                    value={filters.propertyType || ""}
                  >
                    <option value="">Any Type</option>
                    <option value="FLAT">Flat</option>
                    <option value="HOUSE">House</option>
                    <option value="SHOP">Shop</option>
                    <option value="PG">PG</option>
                    <option value="LAND">Land</option>
                  </select>
                </div>

                {showBhkFilter && (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                    <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      BHK Configuration
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          onClick={() =>
                            handleFilterChange({
                              bhk: filters.bhk === n ? undefined : n,
                            })
                          }
                          className={`w-11 h-11 rounded-xl text-xs font-black transition-all border ${filters.bhk === n ? "bg-primary text-white border-primary" : "bg-[color:var(--color-card)] border-[color:var(--color-border)] text-gray-400 hover:border-primary/40"}`}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        onClick={() => handleFilterChange({ bhk: undefined })}
                        className={`px-4 h-11 rounded-xl text-[10px] font-black uppercase transition-all border ${!filters.bhk ? "bg-primary text-white border-primary" : "bg-[color:var(--color-card)] border-[color:var(--color-border)] text-gray-400 hover:border-primary/40"}`}
                      >
                        Any
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 pt-8 border-t border-[color:var(--color-border)]">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Rent Range (₹)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl text-sm font-medium outline-none"
                      onChange={(e) =>
                        handleFilterChange({
                          minRent: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      value={filters.minRent || ""}
                    />
                    <span className="text-gray-300">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl text-sm font-medium outline-none"
                      onChange={(e) =>
                        handleFilterChange({
                          maxRent: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      value={filters.maxRent || ""}
                    />
                  </div>
                </div>

                {showAreaFilter && (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Area Range (Sq. Ft.)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl text-sm font-medium outline-none"
                        onChange={(e) =>
                          handleFilterChange({
                            minArea: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        value={
                          ((filters as Record<string, unknown>)
                            .minArea as string) || ""
                        }
                      />
                      <span className="text-gray-300">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl text-sm font-medium outline-none"
                        onChange={(e) =>
                          handleFilterChange({
                            maxArea: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        value={
                          ((filters as Record<string, unknown>)
                            .maxArea as string) || ""
                        }
                      />
                    </div>
                  </div>
                )}

                <div
                  className={`${showAreaFilter ? "lg:col-span-1" : "lg:col-span-2"} flex items-end justify-end gap-4`}
                >
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-6 py-3.5 text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                  >
                    <RotateCcw size={16} />
                    Reset All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-10 py-3.5 bg-[color:var(--color-foreground)] text-[color:var(--color-surface)] font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-red-500/5 rounded-[3rem] border border-red-500/10">
            <p className="text-red-500 font-bold mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 hover:scale-105 transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-[color:var(--color-surface)] rounded-[3rem] border border-dashed border-[color:var(--color-border)]">
            <div className="w-24 h-24 bg-gray-100/50 dark:bg-white/5 flex items-center justify-center rounded-[2rem] mb-6 text-gray-300">
              <Home size={48} />
            </div>
            <h3 className="text-2xl font-black text-[color:var(--color-foreground)] mb-3">
              No matching properties
            </h3>
            <p className="text-gray-500 max-w-sm text-center font-medium leading-relaxed">
              We couldn't find any properties matching your criteria. Try
              adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                layout={layout}
                isSearchMode={isSearchMode}
              />
            ))}
          </div>
        )}

        {!loading && properties.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[color:var(--color-border)] pt-10 mt-10 gap-6">
            <p className="text-sm text-gray-500 font-bold">
              Showing{" "}
              <span className="text-[color:var(--color-foreground)]">
                {(page - 1) * 6 + 1}
              </span>{" "}
              to{" "}
              <span className="text-[color:var(--color-foreground)]">
                {Math.min(page * 6, total)}
              </span>{" "}
              of{" "}
              <span className="text-[color:var(--color-foreground)]">
                {total}
              </span>{" "}
              premium properties
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo(0, 0);
                }}
                disabled={page === 1}
                className="w-12 h-12 flex items-center justify-center border border-[color:var(--color-border)] rounded-2xl hover:bg-primary/5 hover:border-primary/30 disabled:opacity-20 transition-all text-gray-400 hover:text-primary"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
                      setPage(i + 1);
                      window.scrollTo(0, 0);
                    }}
                    className={`w-12 h-12 rounded-2xl font-black transition-all ${
                      page === i + 1
                        ? "bg-primary text-white shadow-xl shadow-primary/25 scale-110"
                        : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo(0, 0);
                }}
                disabled={page === totalPages}
                className="w-12 h-12 flex items-center justify-center border border-[color:var(--color-border)] rounded-2xl hover:bg-primary/5 hover:border-primary/30 disabled:opacity-20 transition-all text-gray-400 hover:text-primary"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertyPage;
