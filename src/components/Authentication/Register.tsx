import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { registerUser } from '../../services/authService'
import { Eye, EyeOff, Mail, Phone, User } from 'lucide-react'
import { Button, FormMessage, Input, Logo } from '../Common';
import { isLoggedIn, googleLogin } from '../../services/authService';
import { auth, googleProvider } from '../../Config/firebase.config';
import { signInWithPopup } from 'firebase/auth';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const role = (searchParams.get('role') || 'TENANT') as 'TENANT' | 'OWNER';

  const [formData, setFormData] = useState({
    email: '',
    fullname: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setMessage('');
      setIsError(false);
      
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const response = await googleLogin(idToken, role);
      
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setMessage('Registration successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error: any) {
      console.error('Google register error:', error);
      setIsError(true);
      setMessage(error?.response?.data?.message || 'Google registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await registerUser({
        email: formData.email,
        fullname: formData.fullname,
        password: formData.password,
        phone: formData.phone,
        role,
      });

      setMessage('Registration successful');
      setTimeout(() => {
        navigate(`/verify-otp?email=${formData.email}`);
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsError(true);
      setMessage(error?.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // const otherRole = role === 'OWNER' ? 'TENANT' : 'OWNER';

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-b from-[hsl(260,20%,18%)] to-[hsl(260,25%,12%)] p-12 text-white">
        <Logo size="md" />
        <p className="max-w-md text-lg leading-relaxed text-white/70">
          {role === 'OWNER'
            ? 'Manage your rental properties effortlessly...'
            : 'Find your perfect rental home...'}
        </p>
        <div />
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto bg-card px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex lg:hidden justify-center">
            <Logo size="lg" />
          </div>

          <h1 className="mb-1 text-center text-2xl font-bold">Create your account</h1>

          <FormMessage message={message} isError={isError} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="fullname"
              placeholder="John Doe"
              label="Full name"
              value={formData.fullname}
              onChange={handleChange}
              icon={<User className="h-4 w-4" />}
              required
            />

            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail className="h-4 w-4" />}
              required
            />

            <Input
              name="phone"
              type="tel"
              placeholder="+91 9876543210"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              icon={<Phone className="h-4 w-4" />}
              required
            />

            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
            />

            <Input
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
            />

            <Button type="submit" loading={isLoading} className="w-full"  size={'md'}>
              Create account
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50"
              onClick={handleGoogleLogin}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;


// import React, { useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { Home, User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
// import { registerUser } from "../services/authService";

// const Register = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const roleParam = searchParams.get("role");
//   const role: "TENANT" | "OWNER" =
//     roleParam === "OWNER" || roleParam === "TENANT" ? roleParam : "TENANT";

//   const [formData, setFormData] = useState({
//     email: "",
//     fullname: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [mes, setMes] = useState("");
//   const [isError, setIsError] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setMes("");
//     setIsError(false);

//     if (formData.password !== formData.confirmPassword) {
//       setIsError(true);
//       setMes("Passwords do not match");
//       return;
//     }
//     try {
//       const response =  await registerUser({
//         email:formData.email,
//         fullname:formData.fullname,
//         password:formData.password,
//         phone:formData.phone,
//         role:role
//       })

//       console.log('backend ile response',response)
      
//     setMes("Registration successful");
//     setTimeout(()=>{
//       navigate(`/verify-otp?email=${formData.email}`)
//     },2000)

//     } catch (error) {
//       console.error(error,'---------------------handle submit')  
//       setIsError(true)
//       setMes(
//         error?.response?.data?.message || 'something wrong'
//       )                 
//     }

//   };


//   const otherRole = role === "OWNER" ? "TENANT" : "OWNER";

//   return (
//     <div className="flex min-h-screen">
//       {/* Left Panel */}
//       <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-b from-[hsl(260,20%,18%)] to-[hsl(260,25%,12%)] p-12 text-white">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/30">
//             <Home className="h-5 w-5 text-primary" />
//           </div>
//           <span className="text-xl font-bold text-primary">RentEase</span>
//         </div>
//         <p className="max-w-md text-lg leading-relaxed text-white/70">
//           {role === "OWNER"
//             ? "Manage your rental properties effortlessly with RentEase. List properties, connect with verified tenants, create digital agreements, track payments, and handle maintenance requests seamlessly."
//             : "Find your perfect rental home with RentEase. Browse verified listings, connect with property owners, sign digital agreements, and manage your tenancy all in one place."}
//         </p>
//         <div />
//       </div>

//       {/* Right Panel */}
//       <div className="flex flex-1 flex-col items-center overflow-y-auto bg-card px-6 py-10">
//         <div className="w-full max-w-md">

//           <div className="mb-6 flex flex-col items-center gap-3">
//             <p className="text-sm font-medium text-primary">
//               Register as {role === "OWNER" ? "Property Owner" : "Tenant"}
//             </p>
//             <div className="flex items-center gap-0">
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
//                 1
//               </div>
//               <div className="h-0.5 w-8 bg-primary" />
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
//                 2
//               </div>
//             </div>
//             <button
//               onClick={() => navigate(`/register?role=${otherRole}`)}
//               className="text-xs text-muted-foreground hover:text-primary"
//             >
//               ← change user type
//             </button>
//           </div>

//           <h1 className="mb-1 text-center text-2xl font-bold text-card-foreground">
//             Create your account
//           </h1>
//           <p className="mb-6 text-center text-sm text-primary">
//             Get started with RentEase today
//           </p>

//           {mes && (
//             <p className={`mb-4 text-center text-sm font-medium ${isError ? "text-destructive" : "text-green-600"}`}>
//               {mes}
//             </p>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">

//             <div className="space-y-1.5">
//               <span>Full name</span>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <input name="fullname" placeholder="Nandu" value={formData.fullname} onChange={handleChange} className="pl-10" required />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <span>Email</span>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="pl-10" required />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <span>Phone Number</span>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <input name="phone" type="tel" placeholder="+91 9876543210" value={formData.phone} onChange={handleChange} className="pl-10" required />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <span>Password</span>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <input autoComplete="on" name="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={formData.password} onChange={handleChange} className="pl-10 pr-10" required />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <span>Confirm Password</span>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <input autoComplete="on" name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Create a strong Password" value={formData.confirmPassword} onChange={handleChange} className="pl-10 pr-10" required />
//                 <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
//                   {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <button type="submit" className="w-full">
//               Create account
//             </button>
//           </form>

//           <p className="mt-6 text-center text-sm text-muted-foreground">
//             Already have an account?{" "}
//             <button onClick={() => navigate("/login")} className="font-medium text-primary hover:underline">
//               Sign in
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
