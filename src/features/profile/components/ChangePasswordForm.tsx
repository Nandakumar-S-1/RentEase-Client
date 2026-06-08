import React, { useState } from "react";
import {
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { changePassword } from "../services/profileService";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "../../../types/common";

const ChangePasswordForm: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "New passwords do not match";
    }
    if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors below");
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword(formData);
      if (res.success) {
        toast.success(res.message || "Password updated successfully");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({});
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to change password"));
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (field: keyof typeof showPass) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <ShieldCheck size={24} />
          </div>
          Change Password
        </h2>
        <p className="text-gray-500 font-medium mt-2">
          Update your password regularly to keep your account secure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-1">
            Current Password
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPass.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className={`w-full pl-12 pr-12 py-4 bg-gray-50/50 dark:bg-white/5 border ${errors.currentPassword ? "border-red-500" : "border-gray-100 dark:border-white/10"} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium`}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => toggleVisibility("current")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-1">
              New Password
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPass.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-12 py-4 bg-gray-50/50 dark:bg-white/5 border ${errors.newPassword ? "border-red-500" : "border-gray-100 dark:border-white/10"} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium`}
                placeholder="Minimum 8 chars"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.newPassword}
                </p>
              )}
              <button
                type="button"
                onClick={() => toggleVisibility("new")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-1">
              Confirm New Password
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPass.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full pl-12 pr-12 py-4 bg-gray-50/50 dark:bg-white/5 border ${errors.confirmPassword ? "border-red-500" : "border-gray-100 dark:border-white/10"} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium`}
                placeholder="Repeat new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.confirmPassword}
                </p>
              )}
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest">
            <AlertCircle size={14} /> Password Requirements
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <li
              className={`flex items-center gap-2 text-xs font-bold ${formData.newPassword.length >= 8 ? "text-emerald-600" : "text-gray-500"}`}
            >
              <CheckCircle2 size={12} /> At least 8 characters
            </li>
            <li
              className={`flex items-center gap-2 text-xs font-bold ${/[A-Z]/.test(formData.newPassword) ? "text-emerald-600" : "text-gray-500"}`}
            >
              <CheckCircle2 size={12} /> One uppercase letter
            </li>
            <li
              className={`flex items-center gap-2 text-xs font-bold ${/[0-9]/.test(formData.newPassword) ? "text-emerald-600" : "text-gray-500"}`}
            >
              <CheckCircle2 size={12} /> One numeric digit
            </li>
            <li
              className={`flex items-center gap-2 text-xs font-bold ${formData.newPassword && formData.newPassword === formData.confirmPassword ? "text-emerald-600" : "text-gray-500"}`}
            >
              <CheckCircle2 size={12} /> Passwords must match
            </li>
            <li
              className={`flex items-center gap-2 text-xs font-bold ${formData.newPassword && formData.currentPassword !== formData.newPassword ? "text-emerald-600" : "text-gray-500"}`}
            >
              <CheckCircle2 size={12} /> Must be different from current
            </li>
          </ul>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-fit px-12 py-4 bg-primary text-white font-black rounded-lg shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </div>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
