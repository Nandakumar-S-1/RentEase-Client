import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { X, Upload, PenTool } from "lucide-react";
import toast from "react-hot-toast";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signatureData: string) => void;
  role: "OWNER" | "TENANT";
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSign,
  role,
}) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [tab, setTab] = useState<"draw" | "upload">("draw");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const clear = () => {
    sigCanvas.current?.clear();
    setUploadedImage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (tab === "draw") {
      if (sigCanvas.current?.isEmpty()) {
        toast.error("Please provide a signature first.");
        return;
      }
      const signatureData = sigCanvas.current
        ?.getCanvas()
        .toDataURL("image/png");
      if (signatureData) onSign(signatureData);
    } else {
      if (!uploadedImage) {
        toast.error("Please upload a signature image first.");
        return;
      }
      onSign(uploadedImage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Digital Signature
            </h3>
            <p className="text-sm text-gray-500">
              Sign as {role === "OWNER" ? "Property Owner" : "Tenant"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setTab("draw")}
              className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${tab === "draw" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <PenTool className="w-4 h-4" /> Draw
            </button>
            <button
              onClick={() => setTab("upload")}
              className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${tab === "upload" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Upload className="w-4 h-4" /> Upload
            </button>
          </div>

          {tab === "draw" ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden group hover:border-blue-400 transition-colors">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="blue"
                canvasProps={{ className: "w-full h-48 cursor-crosshair" }}
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-48 bg-gray-50 group hover:border-blue-400 transition-colors">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded signature"
                  className="max-h-full object-contain"
                />
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Click to upload signature
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 2MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
          <button
            onClick={clear}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
          <div className="space-x-3 flex">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all"
            >
              Save Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
