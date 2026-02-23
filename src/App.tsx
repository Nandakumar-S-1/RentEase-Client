import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Authentication/Register';
import RoleSelection from './components/Authentication/RoleSelection';
import Login from './components/Authentication/Login';
import VerifyOtp from './components/Authentication/VerifyOtp';
import Dashboard from './components/Pages/Dashboard';
import ResendOtp from './components/Authentication/ResendOtp';
import ForgotPassword from './components/Authentication/ForgotPassword';
import AdminLogin from './components/Authentication/AdminLogin';
import PublicRoute from './components/Common/PublicRoute';
import ProtectedRoute from './components/Common/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><RoleSelection /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path='/resend-otp' element={<PublicRoute><ResendOtp /></PublicRoute>}></Route>

        <Route path='/verify-otp' element={<VerifyOtp />}></Route>
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>
        <Route path='/admin/users' element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
