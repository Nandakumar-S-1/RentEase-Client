import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
   ArrowLeft,
   Edit3,
   Trash2,
   Clock,
   MapPin,
   Maximize2,
   Layers,
   Bed,
   EyeOff,
   Wrench,
   Heart,
   CheckCircle,
   XCircle,
   AlertCircle,
   TrendingUp,
   Eye,
   X,
} from "lucide-react";
import { usePropertyDetail } from "../hooks/usePropertyDetail";
import { LoadingOverlay, Modal } from "../../../components/common";
import { PAGE_ROUTES } from "../../../config/routes";
import { unlistProperty, relistProperty, deleteProperty } from "../services/propertyService";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";

const OwnerPropertyDetails = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { user } = useSelector((state: RootState) => state.auth);
   const { property, loading } = usePropertyDetail(id);

   const [isUnlistModalOpen, setIsUnlistModalOpen] = React.useState(false);
   const [isRelistModalOpen, setIsRelistModalOpen] = React.useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
   const [activePhotoIndex, setActivePhotoIndex] = React.useState(0);
   const [isZoomOpen, setIsZoomOpen] = React.useState(false);

   if (loading || !property) return <LoadingOverlay />;

   const handleEdit = () => {
      navigate(PAGE_ROUTES.OWNER_EDIT_PROPERTY.replace(":id", property.id));
   };

   const handleUnlist = async () => {
      try {
         await unlistProperty(property.id);
         toast.success("Property unlisted successfully");
         navigate(PAGE_ROUTES.OWNER_PROPERTIES);
      } catch (err) {
         console.error("Failed to unlist property:", err);
         toast.error("Failed to unlist property");
      }
   };

   const handleRelist = async () => {
      try {
         await relistProperty(property.id);
         toast.success("Property listed successfully");
         navigate(PAGE_ROUTES.OWNER_PROPERTIES);
      } catch (err) {
         console.error("Failed to relist property:", err);
         toast.error("Failed to relist property");
      }
   };

   const handleDelete = async () => {
      try {
         await deleteProperty(property.id);
         toast.success("Property deleted permanently");
         navigate(PAGE_ROUTES.OWNER_PROPERTIES);
      } catch (err) {
         console.error("Failed to delete property:", err);
         toast.error("Failed to delete property");
      }
   };

   const getStatusConfig = () => {
      switch (property.status) {
         case "PENDING_APPROVAL":
            return {
               color: "text-amber-600",
               bg: "bg-amber-50",
               border: "border-amber-100",
               icon: Clock,
               label: "Verification Pending",
            };
         case "ACTIVE":
         case "APPROVED":
            return {
               color: "text-emerald-600",
               bg: "bg-emerald-50",
               border: "border-emerald-100",
               icon: CheckCircle,
               label: "Live & Active",
            };
         case "REJECTED":
            return {
               color: "text-rose-600",
               bg: "bg-rose-50",
               border: "border-rose-100",
               icon: XCircle,
               label: "Rejected",
            };
         default:
            return {
               color: "text-gray-600",
               bg: "bg-gray-50",
               border: "border-gray-100",
               icon: AlertCircle,
               label: property.status,
            };
      }
   };

   const status = getStatusConfig();

   return (
      <DashboardLayout role={user?.role as RoleType} userName={user?.fullname || "User"}>
         <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
               <div>
                  <button
                     onClick={() => navigate(PAGE_ROUTES.OWNER_PROPERTIES)}
                     className="group flex items-center gap-2 text-sm font-black text-gray-400 hover:text-primary transition-all mb-4"
                  >
                     <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                     BACK TO PORTFOLIO
                  </button>
                  <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2">
                     Property Analytics
                  </h1>
                  <p className="text-gray-400 font-medium tracking-tight">Management portal for {property.title}</p>
               </div>

               <div className="flex flex-wrap gap-3">
                  <button
                     onClick={handleEdit}
                     className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-sm"
                  >
                     <Edit3 size={16} /> Edit
                  </button>
                  <button
                     onClick={() => navigate(`/owner/properties/${property.id}/service-providers`)}
                     className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
                  >
                     <Wrench size={16} /> Services
                  </button>
                  <div className="h-12 w-[1px] bg-gray-100 dark:bg-white/5 mx-2 hidden md:block" />
                  {property.status === "UNLISTED" && (
                     <button
                        onClick={() => setIsRelistModalOpen(true)}
                        className="p-3.5 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-colors"
                        title="Relist Property"
                     >
                        <Eye size={20} />
                     </button>
                  )}
                  {property.status === "ACTIVE" && (
                     <button
                        onClick={() => setIsUnlistModalOpen(true)}
                        className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-100 transition-colors"
                        title="Unlist Property"
                     >
                        <EyeOff size={20} />
                     </button>
                  )}
                  <button
                     onClick={() => setIsDeleteModalOpen(true)}
                     className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-colors"
                     title="Delete Permanently"
                  >
                     <Trash2 size={20} />
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-8 space-y-10">
                  <div
                     className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl group cursor-zoom-in"
                     onClick={() => setIsZoomOpen(true)}
                  >
                     {property.photos?.[activePhotoIndex] ? (
                        <img
                           src={property.photos[activePhotoIndex]}
                           alt="Main"
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                     ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">No Main Image</div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                     {property.status === "REJECTED" && (
                        <div className="absolute top-10 left-10 right-10 p-6 bg-red-600/90 backdrop-blur-md rounded-3xl border border-red-500 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                           <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                 <AlertCircle className="text-white" size={24} />
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-white font-black uppercase tracking-widest text-xs mb-1">Listing Rejected</h4>
                                 <p className="text-white/90 text-sm font-medium leading-relaxed">
                                    {property.rejectionReason || "No specific reason provided by the auditor."}
                                 </p>
                                 <button
                                    onClick={handleEdit}
                                    className="mt-4 px-6 py-2 bg-white text-red-600 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                                 >
                                    Fix & Resubmit
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}

                     <div className="absolute bottom-10 left-10 text-white">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 ${status.bg} ${status.color}`}>
                           <status.icon size={14} />
                           {status.label}
                        </div>
                        <h2 className="text-3xl font-black">{property.title}</h2>
                        <div className="flex items-center gap-2 text-white/80 font-medium text-sm mt-2">
                           <MapPin size={16} />
                           {property.fullAddress}, {property.locationCity}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {[
                        { label: "Configuration", val: `${property.bhk || 0} BHK`, icon: Bed, color: "bg-blue-500" },
                        { label: "Total Area", val: `${property.areaSqft || 0} SQFT`, icon: Maximize2, color: "bg-emerald-500" },
                        { label: "Floor Detail", val: property.floorNumber || "N/A", icon: Layers, color: "bg-violet-500" },
                        { label: "Monthly Rent", val: `₹${property.monthlyRent?.toLocaleString() || 0}`, icon: TrendingUp, color: "bg-primary" },
                     ].map((item, i) => (
                        <div key={i} className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm hover:translate-y-[-4px] transition-all">
                           <div className={`w-10 h-10 ${item.color}/10 rounded-xl flex items-center justify-center mb-4`}>
                              <item.icon size={20} className={item.color.replace("bg-", "text-")} />
                           </div>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                           <p className="text-lg font-black text-gray-800 dark:text-white">{item.val}</p>
                        </div>
                     ))}
                  </div>

                  <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                     <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-primary rounded-full" />
                        About the Listing
                     </h3>
                     <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg font-medium">
                        {property.description}
                     </p>
                  </div>

                  {property.amenities && property.amenities.length > 0 && (
                     <div className="space-y-8">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                           <span className="w-1.5 h-6 bg-primary rounded-full" />
                           Amenities & Features
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                           {property.amenities.map((amenity: string) => (
                              <div key={amenity} className="flex items-center gap-3 p-5 bg-white dark:bg-card border border-gray-100 rounded-3xl group hover:border-primary/30 transition-all">
                                 <div className="p-2 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                                    <CheckCircle size={18} />
                                 </div>
                                 <span className="font-bold text-gray-700 dark:text-gray-300">{amenity}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-gray-100">
                     <div className="space-y-6">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                           <span className="w-1.5 h-6 bg-primary rounded-full" />
                           House Rules
                        </h3>
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
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                           <span className="w-1.5 h-6 bg-primary rounded-full" />
                           Other Details
                        </h3>
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
                     <div className="flex items-center justify-between px-4">
                        <h3 className="text-xl font-black">All Property Media</h3>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{property.photos?.length || 0} Photos</span>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {property.photos?.map((src: string, i: number) => (
                           <div
                              key={i}
                              onClick={() => setActivePhotoIndex(i)}
                              className={`aspect-square rounded-[2rem] overflow-hidden border-4 shadow-lg group cursor-pointer transition-all ${activePhotoIndex === i ? "border-primary scale-95" : "border-white dark:border-white/5 opacity-70 hover:opacity-100"}`}
                           >
                              <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery" />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-10">
                  <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[3rem] p-10 shadow-sm space-y-8 sticky top-10">
                     <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Live Performance</h3>

                     <div className="space-y-6">
                        <div className="flex items-center gap-5 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl group cursor-help transition-all hover:bg-primary/5">
                           <div className="w-14 h-14 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                              <TrendingUp size={28} />
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-400 uppercase tracking-tight leading-none mb-1">Total Impact</p>
                              <p className="text-3xl font-black text-gray-800 dark:text-white">{property.viewsCount || 0}</p>
                              <p className="text-[10px] font-bold text-gray-400">Profile Views</p>
                           </div>
                        </div>

                        <div className="flex items-center gap-5 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl group cursor-help transition-all hover:bg-rose-50 dark:hover:bg-rose-500/10">
                           <div className="w-14 h-14 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                              <Heart size={28} />
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-400 uppercase tracking-tight leading-none mb-1">Engagement</p>
                              <p className="text-3xl font-black text-gray-800 dark:text-white">{property.wishlistCount || 0}</p>
                              <p className="text-[10px] font-bold text-gray-400">Total Wishlists</p>
                           </div>
                        </div>
                     </div>

                     <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                        <div className="flex items-center gap-3 mb-2">
                           <AlertCircle className="text-primary" size={16} />
                           <p className="text-[10px] font-black text-primary uppercase tracking-widest">Listing Tip</p>
                        </div>
                        <p className="text-xs text-primary/70 font-medium leading-relaxed italic">
                           Properties with clear, well-lit photos get 3x more inquiries. Keep your media high-resolution!
                        </p>
                     </div>

                     <button className="w-full py-5 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all">
                        View Detailed Insights
                     </button>
                  </div>
               </div>
            </div>

            {/* Modals */}
            <Modal
               isOpen={isUnlistModalOpen}
               onClose={() => setIsUnlistModalOpen(false)}
               onConfirm={handleUnlist}
               title="Unlist Property"
               description="Are you sure you want to unlist this property? It will no longer be visible to potential tenants."
               confirmText="Unlist"
               isDestructive={false}
            />

            <Modal
               isOpen={isRelistModalOpen}
               onClose={() => setIsRelistModalOpen(false)}
               onConfirm={handleRelist}
               title="Relist Property"
               description="Are you sure you want to list this property again? It will become visible to all potential tenants."
               confirmText="List Property"
               isDestructive={false}
            />

            <Modal
               isOpen={isDeleteModalOpen}
               onClose={() => setIsDeleteModalOpen(false)}
               onConfirm={handleDelete}
               title="Delete Permanently"
               description="Are you sure you want to PERMANENTLY delete this property? This action cannot be undone."
               confirmText="Delete"
               isDestructive={true}
            />

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
                  </div>
               </div>
            )}
         </div>
      </DashboardLayout>
   );
};

export default OwnerPropertyDetails;
