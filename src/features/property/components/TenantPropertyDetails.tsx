import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
   ArrowLeft,
   MapPin,
   Maximize2,
   Bed,
   Bath,
   CheckCircle2,
   Shield,
   Heart,
   Share2,
   Phone,
   Mail,
   User as UserIcon,
   Layers,
   X,
} from "lucide-react";
import { usePropertyDetail } from "../hooks/usePropertyDetail";
import { useWishlist } from "../hooks/useWishlist";
import { LoadingOverlay } from "../../../components/common";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";

import { toast } from "react-hot-toast";


const TenantPropertyDetails = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { user } = useAppSelector((state: RootState) => state.auth);
   const { property, loading } = usePropertyDetail(id);
   const { isSaved, toggle } = useWishlist(id || "");
   const [activePhotoIndex, setActivePhotoIndex] = useState(0);
   const [isZoomOpen, setIsZoomOpen] = useState(false);

   if (loading || !property) return <LoadingOverlay />;

   const handleContact = () => {
      toast.success("Contacting owner feature coming soon!", { icon: "📞" });
   };

   return (
      <DashboardLayout role={user?.role as RoleType} userName={user?.fullname || "Tenant"}>
         <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
               <button
                  onClick={() => navigate(-1)}
                  className="p-3 bg-white dark:bg-card border border-gray-100 rounded-2xl shadow-sm text-gray-500 hover:text-primary transition-all"
               >
                  <ArrowLeft size={20} />
               </button>
               <div className="flex gap-2">
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        toggle();
                     }}
                     className={`p-3 rounded-2xl shadow-sm transition-all border ${isSaved ? "bg-red-50 text-red-500 border-red-100" : "bg-white dark:bg-card text-gray-400 border-gray-100 hover:text-red-400"}`}
                  >
                     <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                  <button className="p-3 bg-white dark:bg-card border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-primary transition-all">
                     <Share2 size={20} />
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               {/* Main Content (Left) */}
               <div className="lg:col-span-2 space-y-10">
                  {/* Header Info */}
                  <div className="space-y-4">
                     <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">Verified Listing</span>
                        <span className="px-4 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg">{property.propertyType}</span>
                        {property.furnishingStatus && <span className="px-4 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">{property.furnishingStatus}</span>}
                     </div>
                     <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">{property.title}</h1>
                     <div className="flex items-center gap-2 text-gray-500 font-medium text-lg">
                        <MapPin size={20} className="text-primary" />
                        {property.fullAddress || `${property.locationCity}, ${property.locationDistrict}`}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                     <div 
                        className="md:col-span-3 rounded-[2.5rem] overflow-hidden shadow-2xl cursor-zoom-in group relative"
                        onClick={() => setIsZoomOpen(true)}
                     >
                        <img
                           src={property.photos[activePhotoIndex]}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                           alt="Property Main"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                           <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={48} />
                        </div>
                     </div>
                     <div className="hidden md:grid grid-rows-4 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                        {property.photos.map((img: string, i: number) => (
                           <div 
                              key={i} 
                              onClick={() => setActivePhotoIndex(i)}
                              className={`rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all border-2 ${activePhotoIndex === i ? "border-primary ring-2 ring-primary/20 scale-95" : "border-transparent opacity-70 hover:opacity-100"}`}
                           >
                              <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white dark:bg-card border border-gray-100 rounded-[2.5rem] shadow-sm">
                     <div className="flex flex-col items-center gap-2 text-center p-4 rounded-2xl hover:bg-gray-50 transition-all">
                        <Bed size={24} className="text-primary" />
                        <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">BHK</p>
                           <p className="text-sm font-black text-gray-900 dark:text-white">{property.bhk || 0} Bedroom</p>
                        </div>
                     </div>
                     <div className="flex flex-col items-center gap-2 text-center p-4 rounded-2xl hover:bg-gray-50 transition-all">
                        <Bath size={24} className="text-primary" />
                        <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bathrooms</p>
                           <p className="text-sm font-black text-gray-900 dark:text-white">{property.bathrooms || 0} Bath</p>
                        </div>
                     </div>
                     <div className="flex flex-col items-center gap-2 text-center p-4 rounded-2xl hover:bg-gray-50 transition-all">
                        <Maximize2 size={24} className="text-primary" />
                        <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Area</p>
                           <p className="text-sm font-black text-gray-900 dark:text-white">{property.areaSqft || 0} sqft</p>
                        </div>
                     </div>
                     <div className="flex flex-col items-center gap-2 text-center p-4 rounded-2xl hover:bg-gray-50 transition-all">
                        <Layers size={24} className="text-primary" />
                        <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Floor</p>
                           <p className="text-sm font-black text-gray-900 dark:text-white">{property.floorNumber || "G"}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-2xl font-black text-gray-900 dark:text-white">The Property</h3>
                     <p className="text-gray-500 leading-[2] text-lg font-medium">{property.description}</p>
                  </div>

                  <div className="space-y-8">
                     <h3 className="text-2xl font-black text-gray-900 dark:text-white">Amenities & Features</h3>
                     {property.amenities && property.amenities.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                           {property.amenities.map((amenity: string) => (
                              <div key={amenity} className="flex items-center gap-3 p-5 bg-white dark:bg-card border border-gray-100 rounded-3xl group hover:border-primary/30 transition-all">
                                 <div className="p-2 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                                    <CheckCircle2 size={18} />
                                 </div>
                                 <span className="font-bold text-gray-700 dark:text-gray-300">{amenity}</span>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-gray-400 font-bold italic">No specific amenities listed.</p>
                     )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">House Rules</h3>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100">
                              <span className="font-bold text-gray-600">Pets Allowed</span>
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${property.petsAllowed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                                 {property.petsAllowed ? "Yes" : "No"}
                              </span>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100">
                              <span className="font-bold text-gray-600">Smoking Allowed</span>
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${property.smokingAllowed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                                 {property.smokingAllowed ? "Yes" : "No"}
                              </span>
                           </div>
                           {property.maximumOccupants && (
                              <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100">
                                 <span className="font-bold text-gray-600">Max Occupants</span>
                                 <span className="font-black text-gray-900 dark:text-white">{property.maximumOccupants} Persons</span>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Other Details</h3>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100">
                              <span className="font-bold text-gray-600">Property Age</span>
                              <span className="font-black text-gray-900 dark:text-white">{property.propertyAge || "New"}</span>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100">
                              <span className="font-bold text-gray-600">Facing</span>
                              <span className="font-black text-gray-900 dark:text-white">{property.facingDirection || "Not Specified"}</span>
                           </div>
                           {property.preferredTenantType && property.preferredTenantType.length > 0 && (
                              <div className="flex flex-col gap-3 p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100">
                                 <span className="font-bold text-gray-600">Preferred Tenants</span>
                                 <div className="flex flex-wrap gap-2">
                                    {property.preferredTenantType.map((t: string) => (
                                       <span key={t} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg">{t}</span>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-2xl font-black text-gray-900 dark:text-white">Location</h3>
                     <div className="h-96 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative bg-gray-50 flex items-center justify-center text-gray-400 font-bold">
                        Map functionality not available yet!
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
                           <p className="text-xs font-black uppercase text-primary tracking-widest mb-1">Exact Area</p>
                           <p className="text-sm font-bold text-gray-900">{property.locationCity}, {property.locationDistrict}</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="space-y-8 lg:block relative">
                  <div className="sticky top-6 space-y-8">
                     <div className="bg-white dark:bg-card border border-gray-100 rounded-[3rem] p-10 shadow-2xl shadow-primary/5">
                        <div className="mb-10 text-center">
                           <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Monthly Rent</p>
                           <div className="flex items-center justify-center gap-1">
                              <span className="text-5xl font-black text-primary">₹{property.monthlyRent?.toLocaleString()}</span>
                              <span className="text-gray-400 font-bold self-end pb-1">/mo</span>
                           </div>
                        </div>

                        <div className="space-y-4 mb-10">
                           <div className="flex justify-between items-center py-4 border-b border-gray-50">
                              <span className="text-gray-500 font-bold">Security Deposit</span>
                              <span className="font-black text-gray-900 dark:text-white">₹{property.depositAmount?.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center py-4 border-b border-gray-50">
                              <span className="text-gray-500 font-bold">Maintenance</span>
                              <span className="font-black text-green-600">
                                 {property.maintenanceIncluded ? "Included" : `₹${property.maintenanceCharges?.toLocaleString()}`}
                              </span>
                           </div>
                           <div className="flex justify-between items-center py-4 border-b border-gray-50">
                              <span className="text-gray-500 font-bold">Available From</span>
                              <span className="font-black text-gray-900 dark:text-white">Immediate</span>
                           </div>
                        </div>

                        <button
                           onClick={handleContact}
                           className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all text-lg mb-4"
                        >
                           Contact Owner
                        </button>

                        <div className="flex items-center justify-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                           <Shield size={14} className="text-emerald-500" />
                           Safe & Secure Listing
                        </div>
                     </div>

                     {/* Owner Card Short */}
                     <div className="bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-8 space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">Listed By</h4>
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-2xl bg-white dark:bg-card shadow-sm flex items-center justify-center text-primary border border-gray-100">
                              <UserIcon size={32} />
                           </div>
                           <div>
                              <h5 className="font-black text-lg text-gray-900 dark:text-white">Verified Owner</h5>
                              <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                 <CheckCircle2 size={12} /> Email Verified
                              </p>
                           </div>
                        </div>
                        <div className="space-y-3 pt-4">
                           <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                              <Phone size={14} className="text-gray-400" />
                              <span>+91 9*******10</span>
                           </div>
                           <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                              <Mail size={14} className="text-gray-400" />
                              <span>o*********@gmail.com</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Image Zoom Lightbox */}
         {isZoomOpen && (
            <div 
               className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
               onClick={() => setIsZoomOpen(false)}
            >
               <button 
                  className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[210]"
                  onClick={(e) => { e.stopPropagation(); setIsZoomOpen(false); }}
               >
                  <X size={32} />
               </button>
               
               <div className="max-w-6xl w-full aspect-video relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/5 animate-in zoom-in-95 duration-500">
                  <img 
                     src={property.photos[activePhotoIndex]} 
                     className="w-full h-full object-contain" 
                     alt="Zoomed" 
                  />
                  
                  <div className="absolute bottom-10 left-10 right-10 flex justify-center gap-4">
                     {property.photos.map((_, i) => (
                        <button 
                           key={i}
                           onClick={(e) => { e.stopPropagation(); setActivePhotoIndex(i); }}
                           className={`w-3 h-3 rounded-full transition-all ${activePhotoIndex === i ? "bg-primary w-12" : "bg-white/30"}`}
                        />
                     ))}
                  </div>
               </div>
            </div>
         )}
      </DashboardLayout>
   );
};

export default TenantPropertyDetails;
