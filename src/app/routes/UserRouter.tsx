import { Routes, Route } from "react-router-dom";
import PublicRoute from "../guards/PublicRoute";
import ProtectedRoute from "../guards/ProtectedRoute";
import { PAGE_ROUTES } from "../../config/routes";

import RoleSelection from "../../features/auth/components/RoleSelection";
import Register from "../../features/auth/components/Register";
import Login from "../../features/auth/components/Login";
import VerifyOtp from "../../features/otp/components/VerifyOtp";
import ForgotPassword from "../../features/auth/components/ForgotPassword";
import Dashboard from "../../components/pages/Dashboard";
import OwnerVerification from "../../features/verification/components/OwnerVerification";
import ProfilePage from "../../features/profile/components/ProfilePage";
import ChatPage from "../../features/chat/components/ChatPage";
import PropertyPage from "../../features/property/components/PropertyPage";
import AddProperty from "../../features/property/components/AddProperty";
import TenantPropertyDetails from "../../features/property/components/TenantPropertyDetails";
import OwnerPropertyDetails from "../../features/property/components/OwnerPropertyDetails";
import EditProperty from "../../features/property/components/EditProperty";
import WishlistPage from "../../features/property/components/WishlistPage";
import ServiceProviderManagement from "../../features/property/components/ServiceProviderManagement";
import NotFound from "../../components/common/NotFound";

import LandingPage from "../../components/pages/LandingPage";

export const UserRouter = () => {
  return (
    <Routes>
      <Route path={PAGE_ROUTES.HOME} element={<LandingPage />} />
      <Route
        path={PAGE_ROUTES.ONBOARDING}
        element={
          <PublicRoute>
            <RoleSelection />
          </PublicRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.REGISTER}
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.FORGOT_PASSWORD}
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route path={PAGE_ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
      <Route
        path={PAGE_ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.OWNER_VERIFICATION}
        element={
          <ProtectedRoute>
            <OwnerVerification />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.MESSAGES}
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.OWNER_PROPERTIES}
        element={
          <ProtectedRoute>
            <PropertyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.OWNER_ADD_PROPERTY}
        element={
          <ProtectedRoute>
            <AddProperty />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.OWNER_EDIT_PROPERTY}
        element={
          <ProtectedRoute>
            <EditProperty />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.SEARCH_PROPERTIES}
        element={
          <ProtectedRoute>
            <PropertyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.PROPERTY_DETAIL}
        element={
          <ProtectedRoute>
            <TenantPropertyDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.OWNER_PROPERTY_DETAIL}
        element={
          <ProtectedRoute>
            <OwnerPropertyDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.TENANT_WISHLIST}
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.OWNER_PROPERTY_SERVICE_PROVIDERS}
        element={
          <ProtectedRoute>
            <ServiceProviderManagement />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
