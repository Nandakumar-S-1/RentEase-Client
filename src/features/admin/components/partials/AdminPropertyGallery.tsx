import React from "react";
import { X } from "lucide-react";

interface AdminPropertyGalleryProps {
  photos: string[];
  activePhotoIndex: number;
  setActivePhotoIndex: (index: number) => void;
  isZoomOpen: boolean;
  setIsZoomOpen: (open: boolean) => void;
}

export const AdminPropertyGallery: React.FC<AdminPropertyGalleryProps> = ({
  photos,
  activePhotoIndex,
  setActivePhotoIndex,
  isZoomOpen,
  setIsZoomOpen,
}) => {
  return (
    <>
      <div className="bg-white dark:bg-card p-4 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="grid grid-cols-12 gap-4 h-[550px]">
          <div
            className="col-span-12 md:col-span-9 rounded-[2.5rem] overflow-hidden relative group cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          >
            <img
              src={photos[activePhotoIndex]}
              className="w-full h-full object-cover"
              alt="Audit View"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                High Resolution Capture
              </p>
              <p className="font-bold">
                Shot {activePhotoIndex + 1} of {photos.length}
              </p>
            </div>
          </div>

          <div className="hidden md:flex md:col-span-3 flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setActivePhotoIndex(i)}
                className={`relative flex-shrink-0 aspect-square rounded-[1.5rem] overflow-hidden border-4 transition-all ${
                  activePhotoIndex === i
                    ? "border-primary scale-[0.98]"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={photo}
                  className="w-full h-full object-cover"
                  alt={`Audit Thumbnail ${i}`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zoom Lightbox */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in duration-500"
          onClick={() => setIsZoomOpen(false)}
        >
          <button className="absolute top-10 right-10 p-5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[210]">
            <X size={40} />
          </button>
          <div className="max-w-7xl w-full h-full p-8 animate-in zoom-in-95 duration-700">
            <img
              src={photos[activePhotoIndex]}
              className="w-full h-full object-contain"
              alt="Zoomed Audit View"
            />
          </div>
        </div>
      )}
    </>
  );
};
