import React from "react";
import { X, Plus, Upload } from "lucide-react";

interface StepPhotosProps {
  files: File[];
  previews: string[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  existingPhotos?: string[];
  onRemoveExistingPhoto?: (index: number) => void;
}

export const StepPhotos: React.FC<StepPhotosProps> = ({
  files,
  previews,
  onFileChange,
  onRemoveFile,
  fileInputRef,
  existingPhotos = [],
  onRemoveExistingPhoto,
}) => {
  const totalPhotosCount = existingPhotos.length + files.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-[color:var(--color-foreground)]">
            Manage Property Photos
          </h3>
          <p className="text-xs text-[color:var(--color-muted-foreground)] font-semibold mt-1">
            Upload up to 5 photos total. The first photo will be the main listing cover image.
          </p>
        </div>
        {totalPhotosCount < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Add Photo
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />

      {totalPhotosCount === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[color:var(--color-border)] hover:border-primary dark:hover:border-primary bg-[color:var(--color-secondary)]/30 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center cursor-pointer group transition-all"
        >
          <div className="w-16 h-16 bg-primary/5 dark:bg-white/5 text-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-all mb-4">
            <Upload size={24} />
          </div>
          <h5 className="text-sm font-black text-[color:var(--color-foreground)]">
            Drag & Drop or Click to Upload
          </h5>
          <p className="text-[10px] text-[color:var(--color-muted-foreground)] font-bold mt-1">
            PNG, JPG, or WEBP up to 5MB (Max 5 photos)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Render Existing (Live) Photos */}
          {existingPhotos.map((src, index) => (
            <div
              key={`existing-${src}`}
              className="relative aspect-square bg-[color:var(--color-secondary)] rounded-3xl overflow-hidden group border border-[color:var(--color-border)]"
            >
              <img
                src={src}
                alt={`Existing ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              {onRemoveExistingPhoto && (
                <button
                  type="button"
                  onClick={() => onRemoveExistingPhoto(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md"
                >
                  <X size={14} />
                </button>
              )}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-md">
                Live
              </div>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                  Primary
                </div>
              )}
            </div>
          ))}

          {/* Render New (Pending Upload) Photos */}
          {previews.map((preview, index) => {
            const displayIndex = existingPhotos.length + index;
            return (
              <div
                key={`new-${preview}`}
                className="relative aspect-square bg-[color:var(--color-secondary)] rounded-3xl overflow-hidden group border border-[color:var(--color-border)]"
              >
                <img
                  src={preview}
                  alt={`New Preview ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md"
                >
                  <X size={14} />
                </button>
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[8px] font-black rounded-md">
                  New
                </div>
                {displayIndex === 0 && (
                  <div className="absolute bottom-2 left-2 px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                    Primary
                  </div>
                )}
              </div>
            );
          })}

          {totalPhotosCount < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-[color:var(--color-border)] hover:border-primary/50 bg-[color:var(--color-secondary)]/30 rounded-3xl flex flex-col items-center justify-center text-[color:var(--color-muted-foreground)] hover:text-primary transition-all gap-2"
            >
              <Plus size={20} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Upload
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
