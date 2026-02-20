import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import RoleSelection from './components/RoleSelection';
import Login from './components/Login';
import VerifyOtp from './components/VerifyOtp';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/register" element={<Register />} />
        <Route path='/verify-otp' element={<VerifyOtp/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
