import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useProperty } from "../hooks/useProperty";
import { Plus } from "lucide-react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useDebounce } from "../../../hooks/useDebounce";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import { useNavigate, useLocation } from "react-router-dom";
import { PAGE_ROUTES } from "../../../config/routes";
import { PropertyStatus } from "../../../types/constants/property.constant";
import { propertyFilterSchema } from "../schemas/propertySchemas";
import { Pagination } from "../../../components/common";
import { PropertyFilters } from "./partials/PropertyFilters";
import { PropertySearchHeader } from "./partials/PropertySearchHeader";
import { PropertyGrid } from "./partials/PropertyGrid";

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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [cityInput, setCityInput] = useState("");
  const debouncedCityInput = useDebounce(cityInput, 500);

  const [minRentInput, setMinRentInput] = useState("");
  const [maxRentInput, setMaxRentInput] = useState("");
  const debouncedMinRent = useDebounce(minRentInput, 500);
  const debouncedMaxRent = useDebounce(maxRentInput, 500);

  const [minAreaInput, setMinAreaInput] = useState("");
  const [maxAreaInput, setMaxAreaInput] = useState("");
  const debouncedMinArea = useDebounce(minAreaInput, 500);
  const debouncedMaxArea = useDebounce(maxAreaInput, 500);

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

  useEffect(() => {
    const value = debouncedSearchTerm;
    const result = propertyFilterSchema.safeParse({ query: value });
    if (result.success) {
      setFilters((prev) => ({ ...prev, query: value }));
      setPage(1);
    }
  }, [debouncedSearchTerm, setFilters, setPage]);

  const handleFilterChange = React.useCallback((newFilters: Record<string, unknown>) => {
    const result = propertyFilterSchema.safeParse(newFilters);
    if (result.success) {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPage(1);
    }
  }, [setFilters, setPage]);

  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
    setCityInput("");
    setMinRentInput("");
    setMaxRentInput("");
    setMinAreaInput("");
    setMaxAreaInput("");
    setPage(1);
  };

  useEffect(() => {
    const value = debouncedCityInput || undefined;
    handleFilterChange({ city: value });
  }, [debouncedCityInput, handleFilterChange]);

  useEffect(() => {
    handleFilterChange({
      minRent: debouncedMinRent ? Number(debouncedMinRent) : undefined,
    });
  }, [debouncedMinRent, handleFilterChange]);

  useEffect(() => {
    handleFilterChange({
      maxRent: debouncedMaxRent ? Number(debouncedMaxRent) : undefined,
    });
  }, [debouncedMaxRent, handleFilterChange]);

  useEffect(() => {
    handleFilterChange({
      minArea: debouncedMinArea ? Number(debouncedMinArea) : undefined,
    });
  }, [debouncedMinArea, handleFilterChange]);

  useEffect(() => {
    handleFilterChange({
      maxArea: debouncedMaxArea ? Number(debouncedMaxArea) : undefined,
    });
  }, [debouncedMaxArea, handleFilterChange]);

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
                  className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${(status || "ALL") === tab.id
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
          <PropertySearchHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            setFilters={setFilters}
            layout={layout as "grid" | "list"}
            setLayout={setLayout}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
          />

          <PropertyFilters
            showFilters={showFilters}
            filters={filters}
            cityInput={cityInput}
            setCityInput={setCityInput}
            handleFilterChange={handleFilterChange}
            showBhkFilter={showBhkFilter}
            showAreaFilter={showAreaFilter}
            minRentInput={minRentInput}
            setMinRentInput={setMinRentInput}
            maxRentInput={maxRentInput}
            setMaxRentInput={setMaxRentInput}
            minAreaInput={minAreaInput}
            setMinAreaInput={setMinAreaInput}
            maxAreaInput={maxAreaInput}
            setMaxAreaInput={setMaxAreaInput}
            resetFilters={resetFilters}
            setShowFilters={setShowFilters}
          />
        </div>

        <PropertyGrid
          loading={loading}
          error={error}
          properties={properties}
          layout={layout as "grid" | "list"}
          isSearchMode={isSearchMode}
        />

        {!loading && totalPages > 1 && (
          <Pagination
            page={page}
            total={total}
            totalPages={totalPages}
            limit={6}
            itemName="premium properties"
            onPageChange={setPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertyPage;
