import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  XCircle,
  MapPin,
  Home as HomeIcon,
  Maximize2,
  Bed,
  Info,
  IndianRupee,
} from "lucide-react";
import { usePropertyDetail } from "../../property/hooks/usePropertyDetail";
import { useAdminProperties } from "../hooks/useAdminProperties";
import { PAGE_ROUTES } from "../../../config/routes";
import { LoadingOverlay } from "../../../components/common";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN 

const AdminPropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, loading: fetchLoading } = usePropertyDetail(id);
  const { approve, reject, loading: actionLoading } = useAdminProperties();

  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = async () => {
    if (!id) return;
    await approve(id);
    navigate(PAGE_ROUTES.ADMIN_PROPERTIES);
  };

  const handleReject = async () => {
    if (!id || !rejectionReason) return;
    await reject(id, rejectionReason);
    navigate(PAGE_ROUTES.ADMIN_PROPERTIES);
  };

  if (fetchLoading || !property) return <LoadingOverlay />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(PAGE_ROUTES.ADMIN_PROPERTIES)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Approvals
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={actionLoading}
            className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm"
          >
            Reject Listing
          </button>
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25"
          >
            Approve Listing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 gap-4 h-[400px]">
            <div className="col-span-2 md:col-span-1 rounded-3xl overflow-hidden shadow-sm">
              <img src={property.photos[0]} className="w-full h-full object-cover" alt="Main" />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-4">
              {property.photos.slice(1, 3).map((photo: string, i: number) => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-sm">
                  <img src={photo} className="w-full h-full object-cover" alt={`P${i}`} />
                </div>
              ))}
              {property.photos.length <= 1 && (
                <div className="rounded-2xl bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase">No more photos</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-card border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <MapPin size={18} className="text-primary" />
                  {property.fullAddress || `${property.locationCity}, ${property.locationDistrict}`}
                </div>
              </div>
              <div className="text-right text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] pt-2">
                ID: {property.id.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-50">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Property Type</p>
                <div className="flex items-center gap-2 text-gray-700 font-black">
                  <HomeIcon size={16} className="text-primary" />
                  {property.propertyType}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Area</p>
                <div className="flex items-center gap-2 text-gray-700 font-black">
                  <Maximize2 size={16} className="text-primary" />
                  {property.areaSqft || "N/A"} SQFT
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Configuration</p>
                <div className="flex items-center gap-2 text-gray-700 font-black">
                  <Bed size={16} className="text-primary" />
                  {property.bhk || 0} BHK
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-lg text-[10px] font-black uppercase border border-yellow-100">
                  {property.status}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="font-black text-lg">Description</h3>
              <p className="text-gray-500 leading-loose text-sm">{property.description}</p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="mt-10 space-y-4">
                <h3 className="font-black text-lg">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a: string) => (
                    <span key={a} className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold text-gray-600 border border-gray-100">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-card border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <IndianRupee size={14} /> Pricing Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-sm font-bold text-gray-600">Monthly Rent</p>
                <p className="text-2xl font-black text-primary">₹{property.monthlyRent?.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                <p className="text-sm font-bold text-gray-600">Security Deposit</p>
                <p className="text-lg font-black text-gray-900 dark:text-white">₹{property.depositAmount?.toLocaleString() || "0"}</p>
              </div>
              {property.maintenanceCharges > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                  <p className="text-sm font-bold text-gray-600">Maintenance</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">₹{property.maintenanceCharges.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-card border border-gray-100 rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4 px-2">Exact Location</h3>
            <div className="h-64 rounded-3xl overflow-hidden border-2 border-gray-50">
              <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                  longitude: property.longitude || 76.2711,
                  latitude: property.latitude || 10.8505,
                  zoom: 13
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
              >
                <Marker
                  longitude={property.longitude || 76.2711}
                  latitude={property.latitude || 10.8505}
                  color="#6366f1"
                />
              </Map>
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
              <Info size={18} />
              <h4 className="font-black text-xs uppercase tracking-widest">Auditor's Note</h4>
            </div>
            <p className="text-[11px] font-bold text-amber-900/60 leading-relaxed">
              Please double check the photos for any restricted content. Ensure the location pinned on the map matches the written address.
            </p>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-card w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Reject Listing</h2>
              <p className="text-sm text-gray-500 font-medium">Please provide a clear reason for rejecting this property listing.</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Blurry photos, Invalid location, Incorrect price..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 rounded-2xl p-4 text-sm min-h-[120px] focus:ring-2 focus:ring-red-200 outline-none transition-all"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason || actionLoading}
                  className="flex-[2] py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-600/20 disabled:opacity-50 transition-all active:scale-95"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPropertyDetails;
