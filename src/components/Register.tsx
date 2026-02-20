import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Home, User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { registerUser } from "../services/authService";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roleParam = searchParams.get("role");
  const role: "TENANT" | "OWNER" =
    roleParam === "OWNER" || roleParam === "TENANT" ? roleParam : "TENANT";

  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mes, setMes] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMes("");
    setIsError(false);

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMes("Passwords do not match");
      return;
    }
    try {
      const response =  await registerUser({
        email:formData.email,
        fullname:formData.fullname,
        password:formData.password,
        phone:formData.phone,
        role:role
      })

      console.log('backend ile response',response)
      
    setMes("Registration successful");
    setTimeout(()=>{
      navigate(`/verify-otp?email=${formData.email}`)
    },2000)

    } catch (error) {
      console.error(error,'---------------------handle submit')  
      setIsError(true)
      setMes(
        error?.response?.data?.message || 'something wrong'
      )                 
    }

  };


  const otherRole = role === "OWNER" ? "TENANT" : "OWNER";

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-b from-[hsl(260,20%,18%)] to-[hsl(260,25%,12%)] p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/30">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-primary">RentEase</span>
        </div>
        <p className="max-w-md text-lg leading-relaxed text-white/70">
          {role === "OWNER"
            ? "Manage your rental properties effortlessly with RentEase. List properties, connect with verified tenants, create digital agreements, track payments, and handle maintenance requests seamlessly."
            : "Find your perfect rental home with RentEase. Browse verified listings, connect with property owners, sign digital agreements, and manage your tenancy all in one place."}
        </p>
        <div />
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto bg-card px-6 py-10">
        <div className="w-full max-w-md">

          <div className="mb-6 flex flex-col items-center gap-3">
            <p className="text-sm font-medium text-primary">
              Register as {role === "OWNER" ? "Property Owner" : "Tenant"}
            </p>
            <div className="flex items-center gap-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                1
              </div>
              <div className="h-0.5 w-8 bg-primary" />
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                2
              </div>
            </div>
            <button
              onClick={() => navigate(`/register?role=${otherRole}`)}
              className="text-xs text-muted-foreground hover:text-primary"
            >
              ← change user type
            </button>
          </div>

          <h1 className="mb-1 text-center text-2xl font-bold text-card-foreground">
            Create your account
          </h1>
          <p className="mb-6 text-center text-sm text-primary">
            Get started with RentEase today
          </p>

          {mes && (
            <p className={`mb-4 text-center text-sm font-medium ${isError ? "text-destructive" : "text-green-600"}`}>
              {mes}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1.5">
              <span>Full name</span>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input name="fullname" placeholder="Nandu" value={formData.fullname} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <span>Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <span>Phone Number</span>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input name="phone" type="tel" placeholder="+91 9876543210" value={formData.phone} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <span>Password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input autoComplete="on" name="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={formData.password} onChange={handleChange} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span>Confirm Password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input autoComplete="on" name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Create a strong Password" value={formData.confirmPassword} onChange={handleChange} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full">
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="font-medium text-primary hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
