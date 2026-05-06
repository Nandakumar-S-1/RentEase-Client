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

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-gray-100 font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0f1c]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-12">
              <Logo className="h-8 w-auto text-primary" />
              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#"
                  className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Properties
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Pricing
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {user ? (
                <button
                  onClick={() => navigate(getDashboardRoute())}
                  className="px-8 py-3 bg-primary text-white text-sm font-black rounded-[1.5rem] shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  Dashboard <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate(PAGE_ROUTES.LOGIN)}
                    className="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/onboarding")}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-2xl shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] bg-[#4338ca]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Trusted by 5,000+ Kerala families
          </div>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1] text-gray-900 dark:text-white">
            Find Your Perfect{" "}
            <span className="text-primary italic">Rental Home</span> <br />
            in Kerala
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 mb-12 leading-relaxed">
            Connect with verified property owners. Seamless rentals from search
            to move-in. Virtual tours, secure payments, and hassle-free
            agreements.
          </p>

          <div className="max-w-4xl mx-auto bg-white dark:bg-[#111c2e] rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none p-3 mb-8 border border-gray-100 dark:border-white/10 transition-colors duration-300">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-2 px-4">
                <div className="flex items-center gap-3 py-3 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/10 font-bold">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
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
                      className="w-full text-sm font-semibold focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 bg-transparent dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/10">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <Home size={18} className="text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Property Type
                    </p>
                    <select
                      value={searchFilters.type}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          type: e.target.value,
                        })
                      }
                      className="w-full text-sm font-semibold focus:outline-none bg-transparent dark:text-white appearance-none"
                    >
                      <option value="" className="dark:bg-[#111c2e]">
                        All Types
                      </option>
                      <option value="HOUSE" className="dark:bg-[#111c2e]">
                        House
                      </option>
                      <option value="FLAT" className="dark:bg-[#111c2e]">
                        Flat/Apartment
                      </option>
                      <option value="PG" className="dark:bg-[#111c2e]">
                        PG/Hostel
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <IndianRupee size={18} className="text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
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
                      className="w-full text-sm font-semibold focus:outline-none bg-transparent dark:text-white appearance-none"
                    >
                      <option value="" className="dark:bg-[#111c2e]">
                        Any Budget
                      </option>
                      <option value="0-5000" className="dark:bg-[#111c2e]">
                        Under 5k
                      </option>
                      <option value="5000-15000" className="dark:bg-[#111c2e]">
                        5k - 15k
                      </option>
                      <option value="15000-30000" className="dark:bg-[#111c2e]">
                        15k - 30k
                      </option>
                      <option value="30000+" className="dark:bg-[#111c2e]">
                        30k+
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-8 py-4 bg-primary text-white font-bold rounded-[1.8rem] flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Search size={20} />
                <span>Search Properties</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <span>Popular:</span>
            <button className="text-gray-900 dark:text-gray-200 font-bold hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
              2 BHK Ernakulam
            </button>
            <button className="text-gray-900 dark:text-gray-200 font-bold hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
              Flat Kochi
            </button>
            <button className="text-gray-900 dark:text-gray-200 font-bold hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
              PG Trivandrum
            </button>
            <button className="text-gray-900 dark:text-gray-200 font-bold hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
              House Thrissur
            </button>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 border-y border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white dark:bg-[#111c2e] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm transition-all">
              <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                5,000+
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Properties Listed
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-[#111c2e] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm transition-all">
              <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                3,200+
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Happy Tenants
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-[#111c2e] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm transition-all">
              <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                ₹50L+
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rent Collected
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-[#111c2e] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm transition-all">
              <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                4.8★
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Average Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 bg-white dark:bg-[#0a0f1c] relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                Featured <span className="text-primary italic">Properties</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                Hand-picked properties verified by our team
              </p>
            </div>
            <button className="group flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-200 hover:text-primary transition-colors">
              View All Properties
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-50 dark:bg-white/5 rounded-[2rem] aspect-[4/3]"
                />
              ))
            ) : properties.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-400 font-medium">
                No verified properties available at the moment.
              </div>
            ) : (
              properties.map((property) => (
                <div
                  key={property.id}
                  className="group bg-white dark:bg-[#111c2e] rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-gray-200 dark:hover:shadow-none transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500">
                    <img
                      src={
                        property.photos[0] ||
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800"
                      }
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 right-4 px-4 py-2 bg-white/95 dark:bg-[#111c2e]/95 text-primary text-sm font-black rounded-2xl backdrop-blur-sm">
                      ₹{property.monthlyRent?.toLocaleString()}/mo
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-lg mb-1 truncate text-gray-900 dark:text-white">
                      {property.title}
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium mb-4">
                      <MapPin size={12} className="text-gray-400" />
                      {property.locationCity}, {property.locationDistrict}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
                      <span className="flex items-center gap-1">
                        {/* <Home size={10} /> {property.bhk} BHK */}
                      </span>
                      <span className="flex items-center gap-1">
                        {property.areaSqft} SQFT
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="text-amber-400 fill-amber-400"
                        />
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
                        className="text-xs font-black uppercase tracking-widest text-primary hover:tracking-[0.15em] transition-all"
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

      <section className="py-24 bg-gray-50/50 dark:bg-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight mb-4 text-gray-900 dark:text-white">
            How <span className="text-primary italic">RentEase</span> Works
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400 font-medium font-lg">
            Simple, transparent, and efficient. Get started in minutes and
            experience hassle-free rentals.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="relative p-10 bg-white dark:bg-[#111c2e] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm text-center transition-all">
            <div className="absolute top-0 right-0 p-4 font-black text-5xl text-gray-50 dark:text-white/5">
              1
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 mx-auto text-primary">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-black mb-4 text-gray-900 dark:text-white">
              List Your Property
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Add your property details, photos, and set your rent in just 5
              minutes. Our verification ensures quality listings.
            </p>
          </div>

          <div className="relative p-10 bg-white dark:bg-[#111c2e] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm text-center transition-all">
            <div className="absolute top-0 right-0 p-4 font-black text-5xl text-gray-50 dark:text-white/5">
              2
            </div>
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 mx-auto text-emerald-600">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-black mb-4 text-gray-900 dark:text-white">
              Connect with Tenants
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Receive inquiries, conduct virtual tours, and chat with verified
              tenants. Find the perfect match for your property.
            </p>
          </div>

          <div className="relative p-10 bg-white dark:bg-[#111c2e] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm text-center transition-all">
            <div className="absolute top-0 right-0 p-4 font-black text-5xl text-gray-50 dark:text-white/5">
              3
            </div>
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 mx-auto text-blue-600">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-black mb-4 text-gray-900 dark:text-white">
              Manage Everything
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Digital agreements, automated rent collection, and maintenance
              tracking. Your complete rental solution.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-[#0a0f1c] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight mb-4 text-gray-900 dark:text-white">
            Loved by <span className="text-primary italic">Thousands</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Join the growing community of satisfied property owners and tenants
            across Kerala
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="p-10 bg-gray-50 dark:bg-[#111c2e] rounded-[2.5rem] relative transition-all border border-transparent dark:border-white/5">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic mb-8">
              "RentEase transformed how I manage my properties. Virtual tours
              save so much time, and the automated rent collection is a
              game-changer. Highly recommended!"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                  alt="Arjun Menon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900 dark:text-white">
                  Arjun Menon
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Property Owner • Ernakulam
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="p-10 bg-primary/5 dark:bg-primary/10 rounded-[2.5rem] relative transition-all border border-transparent dark:border-primary/10">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic mb-8">
              "Found my perfect apartment within a week! The virtual tour
              feature helped me finalize without multiple visits. The agreement
              process was completely digital and hassle-free."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                  alt="Priya Nair"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900 dark:text-white">
                  Priya Nair
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Tenant • Trivandrum
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="p-10 bg-gray-50 dark:bg-[#111c2e] rounded-[2.5rem] relative transition-all border border-transparent dark:border-white/5">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic mb-8">
              "Managing 5 rental properties was overwhelming before RentEase.
              Now everything from tenant screening to maintenance requests is
              streamlined in one place."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
                  alt="Rajesh Kumar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900 dark:text-white">
                  Rajesh Kumar
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Property Owner • Kozhikode
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white dark:bg-[#0a0f1c] transition-colors duration-300">
        <div className="max-w-7xl mx-auto bg-primary rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center text-white shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-[40%] h-full bg-white/5 skew-x-[-20deg] translate-x-[20%]" />

          <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight relative">
            Ready to <span className="italic">Get Started?</span>
          </h2>
          <p className="max-w-2xl mx-auto text-primary-100 mb-16 text-lg font-medium opacity-90 relative">
            Whether you're a property owner looking to list or a tenant
            searching for your next home, RentEase makes it simple.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 relative">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] flex-1 max-w-sm border border-white/10 group hover:bg-white/15 transition-all">
              <h3 className="text-xl font-black mb-4 flex items-center justify-center gap-2">
                I'm a Property Owner
              </h3>
              <p className="text-sm text-primary-100/80 mb-8 font-medium">
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
                className="w-full py-4 bg-white text-primary font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                {user?.role === RoleTypes.OWNER_USER
                  ? "Add Property"
                  : "Get Started"}
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] flex-1 max-w-sm border border-white/10 group hover:bg-white/15 transition-all">
              <h3 className="text-xl font-black mb-4 flex items-center justify-center gap-2">
                I'm Looking for Rental
              </h3>
              <p className="text-sm text-primary-100/80 mb-8 font-medium">
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
                className="w-full py-4 bg-white text-primary font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all"
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
      <footer className="bg-slate-950 dark:bg-[#050810] text-white pt-24 pb-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-8">
              <Logo className="h-8 w-auto text-white" />
              <p className="text-slate-400 font-medium leading-relaxed max-w-xs">
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
                <a
                  href="tel:+919876543210"
                  className="block text-sm text-slate-300 hover:text-primary transition-colors"
                >
                  +91 98765 43210
                </a>
                <p className="text-sm text-slate-500">Kochi, Kerala, India</p>
              </div>
            </div>

            <div>
              <h4 className="font-black text-sm uppercase tracking-widest mb-8 text-slate-500">
                Company
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
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
                    Press
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
              <h4 className="font-black text-sm uppercase tracking-widest mb-8 text-slate-500">
                Product
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
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
              <h4 className="font-black text-sm uppercase tracking-widest mb-8 text-slate-500">
                Legal
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
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
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-500 font-bold">
              © 2026 RentEase. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Star size={20} />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Zap size={20} />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <ShieldCheck size={20} />
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Users size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
