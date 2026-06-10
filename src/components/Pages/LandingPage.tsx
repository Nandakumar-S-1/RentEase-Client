import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Home,
  IndianRupee,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Menu,
  X,
} from "lucide-react";
import Logo from "../common/Logo";
import { PAGE_ROUTES } from "../../config/routes";
import { getAllProperties } from "../../features/property/services/propertyService";
import type { PropertyData } from "../../features/property/types/propertyTypes";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import type { RootState } from "../../app/store/store";
import { RoleTypes } from "../../types/constants/role.constant";

import { ThemeToggle } from "../common/ThemeToggle";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const getDashboardRoute = () => {
    if (!user) return PAGE_ROUTES.LOGIN;
    switch (user.role) {
      case RoleTypes.ADMIN_USER:
        return PAGE_ROUTES.ADMIN_DASHBOARD;
      case RoleTypes.OWNER_USER:
        return PAGE_ROUTES.OWNER_DASHBOARD;
      default:
        return PAGE_ROUTES.TENANT_DASHBOARD;
    }
  };
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    type: "",
    budget: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchFilters.location)
      params.append("location", searchFilters.location);
    if (searchFilters.type) params.append("type", searchFilters.type);
    if (searchFilters.budget) params.append("budget", searchFilters.budget);

    navigate(`${PAGE_ROUTES.SEARCH_PROPERTIES}?${params.toString()}`);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getAllProperties({ page: 1, limit: 4 });
        setProperties(response.data.properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-foreground)] font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[color:var(--color-background)]/80 backdrop-blur-md border-b border-[color:var(--color-border)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4 lg:gap-12">
              <Logo className="h-8 w-auto text-primary" />
              <div className="hidden lg:flex items-center gap-8">
                <a
                  href="#"
                  className="text-sm font-semibold text-[color:var(--color-muted-foreground)] hover:text-primary transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold text-[color:var(--color-muted-foreground)] hover:text-primary transition-colors"
                >
                  Properties
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold text-[color:var(--color-muted-foreground)] hover:text-primary transition-colors"
                >
                  How It Works
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex items-center gap-4">
                <ThemeToggle />
                {user ? (
                  <button
                    onClick={() => navigate(getDashboardRoute())}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    Dashboard <ArrowRight size={16} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate(PAGE_ROUTES.LOGIN)}
                      className="px-5 py-2 text-sm font-bold text-[color:var(--color-muted-foreground)] hover:text-primary transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/onboarding")}
                      className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>

              <div className="md:hidden flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-secondary)] rounded-lg transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)] overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-[400px] py-6" : "max-h-0 py-0"
          }`}
        >
          <div className="px-4 space-y-4">
            <a
              href="#"
              className="block text-base font-bold text-[color:var(--color-muted-foreground)] py-2 hover:text-primary"
            >
              Home
            </a>
            <a
              href="#"
              className="block text-base font-bold text-[color:var(--color-muted-foreground)] py-2 hover:text-primary"
            >
              Properties
            </a>
            <a
              href="#"
              className="block text-base font-bold text-[color:var(--color-muted-foreground)] py-2 hover:text-primary"
            >
              How It Works
            </a>
            <div className="pt-4 space-y-3">
              {user ? (
                <button
                  onClick={() => navigate(getDashboardRoute())}
                  className="w-full px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  Dashboard <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate(PAGE_ROUTES.LOGIN)}
                    className="w-full px-6 py-3 border border-[color:var(--color-border)] text-sm font-bold rounded-xl text-[color:var(--color-foreground)]"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/onboarding")}
                    className="w-full px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-24 pb-12 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold mb-6 sm:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Trusted by 5,000+ Kerala families
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight text-[color:var(--color-foreground)]">
            Find Your Perfect <br className="hidden sm:block" />
            <span className="text-primary italic">Rental Home</span> in Kerala
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[color:var(--color-muted-foreground)] mb-8 sm:mb-12 leading-relaxed px-4">
            Connect with verified property owners. Seamless rentals from search
            to move-in. Virtual tours, secure payments, and hassle-free
            agreements.
          </p>

          <div className="max-w-4xl mx-auto bg-[color:var(--color-surface)] rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl shadow-slate-200/50 dark:shadow-none p-2 sm:p-3 mb-8 border border-[color:var(--color-border)] transition-colors duration-300">
            <div className="flex flex-col gap-2">
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-2 px-2 sm:px-4">
                <div className="flex items-center gap-3 py-3 border-b sm:border-b-0 sm:border-r border-[color:var(--color-border)]">
                  <div className="p-2 bg-[color:var(--color-secondary)] rounded-lg">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-0.5">
                      Location
                    </p>
                    <input
                      type="text"
                      placeholder="Enter City"
                      value={searchFilters.location}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          location: e.target.value,
                        })
                      }
                      className="w-full text-sm font-semibold focus:outline-none placeholder:text-[color:var(--color-muted)]/50 bg-transparent text-[color:var(--color-foreground)] truncate"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-b sm:border-b-0 sm:border-r border-[color:var(--color-border)]">
                  <div className="p-2 bg-[color:var(--color-secondary)] rounded-lg">
                    <Home size={18} className="text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[10px] font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-0.5">
                      Type
                    </p>
                    <select
                      value={searchFilters.type}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          type: e.target.value,
                        })
                      }
                      className="w-full text-sm font-semibold focus:outline-none bg-transparent text-[color:var(--color-foreground)] appearance-none cursor-pointer"
                    >
                      <option
                        value=""
                        className="bg-[color:var(--color-surface)]"
                      >
                        All Types
                      </option>
                      <option
                        value="HOUSE"
                        className="bg-[color:var(--color-surface)]"
                      >
                        House
                      </option>
                      <option
                        value="FLAT"
                        className="bg-[color:var(--color-surface)]"
                      >
                        Flat
                      </option>
                      <option
                        value="PG"
                        className="bg-[color:var(--color-surface)]"
                      >
                        PG/Hostel
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3">
                  <div className="p-2 bg-[color:var(--color-secondary)] rounded-lg">
                    <IndianRupee size={18} className="text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[10px] font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-0.5">
                      Budget
                    </p>
                    <select
                      value={searchFilters.budget}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          budget: e.target.value,
                        })
                      }
                      className="w-full text-sm font-semibold focus:outline-none bg-transparent text-[color:var(--color-foreground)] appearance-none cursor-pointer"
                    >
                      <option
                        value=""
                        className="bg-[color:var(--color-surface)]"
                      >
                        Any Budget
                      </option>
                      <option
                        value="0-5000"
                        className="bg-[color:var(--color-surface)]"
                      >
                        Under 5k
                      </option>
                      <option
                        value="5000-15000"
                        className="bg-[color:var(--color-surface)]"
                      >
                        5k - 15k
                      </option>
                      <option
                        value="15000-30000"
                        className="bg-[color:var(--color-surface)]"
                      >
                        15k - 30k
                      </option>
                      <option
                        value="30000+"
                        className="bg-[color:var(--color-surface)]"
                      >
                        30k+
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="w-full sm:mt-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl sm:rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                <Search size={20} />
                <span>Search Properties</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-[color:var(--color-muted)]">
            <span>Popular:</span>
            <button className="text-[color:var(--color-foreground)] font-bold hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
              2 BHK Ernakulam
            </button>
            <button className="text-[color:var(--color-foreground)] font-bold hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
              Flat Kochi
            </button>
            <button className="text-[color:var(--color-foreground)] font-bold hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
              PG Trivandrum
            </button>
            <button className="text-[color:var(--color-foreground)] font-bold hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
              House Thrissur
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 sm:py-24 bg-[color:var(--color-background)] relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 sm:mb-12">
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[color:var(--color-foreground)]">
                Featured <span className="text-primary italic">Properties</span>
              </h2>
              <p className="text-[color:var(--color-muted-foreground)] font-medium text-sm sm:text-base">
                Hand-picked properties verified by our team
              </p>
            </div>
            <button className="group flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-all">
              View All Properties
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-[color:var(--color-secondary)] rounded-lg aspect-[4/3]"
                />
              ))
            ) : properties.length === 0 ? (
              <div className="col-span-full text-center py-10 text-[color:var(--color-muted-foreground)] font-medium">
                No verified properties available at the moment.
              </div>
            ) : (
              properties.map((property) => (
                <div
                  key={property.id}
                  className="group bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)] overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={
                        property.photos[0] ||
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800"
                      }
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-[color:var(--color-surface)] text-primary text-sm font-bold rounded-xl shadow-lg">
                      ₹{property.monthlyRent?.toLocaleString()}/mo
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 truncate text-[color:var(--color-foreground)]">
                      {property.title}
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-[color:var(--color-muted-foreground)] font-medium mb-4">
                      <MapPin
                        size={12}
                        className="text-[color:var(--color-muted-foreground)] shrink-0"
                      />
                      <span className="truncate">
                        {property.locationCity}, {property.locationDistrict}
                      </span>
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[color:var(--color-muted)] uppercase tracking-wider">
                        {property.areaSqft} SQFT
                      </div>
                      <button
                        onClick={() =>
                          navigate(
                            PAGE_ROUTES.PROPERTY_DETAIL.replace(
                              ":id",
                              property.id,
                            ),
                          )
                        }
                        className="text-xs font-bold text-primary hover:underline transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 border-y border-[color:var(--color-border)] bg-[color:var(--color-secondary)]/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              { label: "Properties Listed", value: "5,000+" },
              { label: "Happy Tenants", value: "3,200+" },
              { label: "Rent Collected", value: "₹50L+" },
              { label: "Average Rating", value: "4.8★" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-4 sm:p-6 bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)] shadow-sm transition-all"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-[color:var(--color-foreground)] mb-1">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs font-bold text-[color:var(--color-muted-foreground)] uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-[color:var(--color-background)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-[color:var(--color-foreground)]">
            How <span className="text-primary italic">RentEase</span> Works
          </h2>
          <p className="max-w-2xl mx-auto text-[color:var(--color-muted-foreground)] font-medium text-sm sm:text-lg px-4">
            Simple, transparent, and efficient. Get started in minutes and
            experience hassle-free rentals.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {[
            {
              step: "1",
              title: "List Your Property",
              desc: "Add property details, photos, and rent in minutes. Our verification ensures quality.",
              icon: <Zap size={32} />,
              color: "bg-primary/10 text-primary",
            },
            {
              step: "2",
              title: "Connect with Tenants",
              desc: "Receive inquiries, conduct tours, and chat with verified tenants easily.",
              icon: <Users size={32} />,
              color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600",
            },
            {
              step: "3",
              title: "Manage Everything",
              desc: "Digital agreements, automated rent, and maintenance tracking in one place.",
              icon: <ShieldCheck size={32} />,
              color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative p-8 sm:p-10 bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-sm text-center transition-all"
            >
              <div className="absolute top-4 right-6 font-black text-4xl sm:text-5xl text-[color:var(--color-muted)]/10 select-none">
                {item.step}
              </div>
              <div
                className={`w-14 h-14 ${item.color} rounded-lg flex items-center justify-center mb-6 sm:mb-8 mx-auto`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 sm:mb-4 text-[color:var(--color-foreground)]">
                {item.title}
              </h3>
              <p className="text-[color:var(--color-muted-foreground)] text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 bg-[color:var(--color-background)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto bg-primary rounded-xl sm:rounded-xl p-8 sm:p-12 lg:p-20 relative overflow-hidden text-center text-white shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-15deg] translate-x-[25%] pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-8 leading-tight relative z-10">
            Ready to <span className="italic font-light">Get Started?</span>
          </h2>
          <p className="max-w-2xl mx-auto text-blue-100 mb-10 sm:mb-16 text-base sm:text-lg font-medium opacity-90 relative z-10">
            Whether you're a property owner looking to list or a tenant
            searching for your next home, RentEase makes it simple.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-lg sm:rounded-xl flex-1 max-w-sm border border-white/10 mx-auto w-full">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                I'm a Property Owner
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/70 mb-6 sm:mb-8">
                List your property and connect with verified tenants
              </p>
              <button
                onClick={() =>
                  navigate(
                    user?.role === RoleTypes.OWNER_USER
                      ? PAGE_ROUTES.OWNER_ADD_PROPERTY
                      : user
                        ? getDashboardRoute()
                        : "/onboarding",
                  )
                }
                className="w-full py-3 sm:py-4 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-all"
              >
                {user?.role === RoleTypes.OWNER_USER
                  ? "Add Property"
                  : "Get Started"}
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-lg sm:rounded-xl flex-1 max-w-sm border border-white/10 mx-auto w-full">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                I'm Looking for Rental
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/70 mb-6 sm:mb-8">
                Find your perfect home from thousands of listings
              </p>
              <button
                onClick={() =>
                  navigate(
                    user?.role === RoleTypes.TENANT_USER
                      ? PAGE_ROUTES.SEARCH_PROPERTIES
                      : user
                        ? getDashboardRoute()
                        : PAGE_ROUTES.LOGIN,
                  )
                }
                className="w-full py-3 sm:py-4 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-all"
              >
                {user?.role === RoleTypes.TENANT_USER
                  ? "Search Now"
                  : "Start Searching"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 sm:pt-24 pb-8 sm:pb-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 mb-16 sm:mb-20">
            <div className="lg:col-span-2 space-y-6 sm:y-8">
              <Logo className="h-8 w-auto text-white" />
              <p className="text-slate-400 font-medium leading-relaxed max-w-xs text-sm sm:text-base">
                Find your perfect rental home in Kerala. Connect with verified
                property owners seamlessly.
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:support@rentease.in"
                  className="block text-sm text-slate-300 hover:text-primary transition-colors"
                >
                  support@rentease.in
                </a>
                <p className="text-sm text-slate-500">Kochi, Kerala, India</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6 sm:mb-8 text-slate-500">
                Company
              </h4>
              <ul className="space-y-3 sm:space-y-4 text-sm font-semibold text-slate-300">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6 sm:mb-8 text-slate-500">
                Product
              </h4>
              <ul className="space-y-3 sm:space-y-4 text-sm font-semibold text-slate-300">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    For Owners
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    For Tenants
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6 sm:mb-8 text-slate-500">
                Legal
              </h4>
              <ul className="space-y-3 sm:space-y-4 text-sm font-semibold text-slate-300">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 font-bold">
              © 2026 RentEase. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Star size={18} />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Zap size={18} />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Users size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
