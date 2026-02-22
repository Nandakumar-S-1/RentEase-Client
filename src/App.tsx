import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Authentication/Register'; 
import RoleSelection from './components/Authentication/RoleSelection';
import Login from './components/Authentication/Login';
import VerifyOtp from './components/Authentication/VerifyOtp'; 
import Dashboard from './components/Pages/Dashboard';
import ResendOtp from './components/Authentication/ResendOtp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/register" element={<Register />} />
        <Route path='/verify-otp' element={<VerifyOtp/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
         <Route path='/resend-otp' element={<ResendOtp/>}></Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
