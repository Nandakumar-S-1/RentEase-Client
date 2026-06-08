import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "../guards/PublicRoute";
import ProtectedRoute from "../guards/ProtectedRoute";
import { PAGE_ROUTES } from "../../config/routes";
import { LoadingOverlay } from "../../components/common";

const RoleSelection = lazy(
  () => import("../../features/auth/components/RoleSelection"),
);
const Register = lazy(() => import("../../features/auth/components/Register"));
const Login = lazy(() => import("../../features/auth/components/Login"));
const VerifyOtp = lazy(() => import("../../features/otp/components/VerifyOtp"));
const ForgotPassword = lazy(
  () => import("../../features/auth/components/ForgotPassword"),
);
const Dashboard = lazy(() => import("../../components/pages/Dashboard"));
const OwnerVerification = lazy(
  () => import("../../features/verification/components/OwnerVerification"),
);
const ProfilePage = lazy(
  () => import("../../features/profile/components/ProfilePage"),
);
const ChatPage = lazy(() => import("../../features/chat/components/ChatPage"));
const PropertyPage = lazy(
  () => import("../../features/property/components/PropertyPage"),
);
const AddProperty = lazy(
  () => import("../../features/property/components/AddProperty"),
);
const TenantPropertyDetails = lazy(
  () => import("../../features/property/components/TenantPropertyDetails"),
);
const OwnerPropertyDetails = lazy(
  () => import("../../features/property/components/OwnerPropertyDetails"),
);
const EditProperty = lazy(
  () => import("../../features/property/components/EditProperty"),
);
const WishlistPage = lazy(
  () => import("../../features/property/components/WishlistPage"),
);
const ServiceProviderManagement = lazy(
  () => import("../../features/property/components/ServiceProviderManagement"),
);
const LandingPage = lazy(() => import("../../components/pages/LandingPage"));
const NotFound = lazy(() => import("../../components/common/NotFound"));
const AgreementDashboard = lazy(
  () => import("../../features/agreements/components/AgreementDashboard"),
);
const AgreementCreationPage = lazy(
  () => import("../../features/agreements/components/AgreementCreationPage"),
);

export const UserRouter = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
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
        <Route
          path={PAGE_ROUTES.OWNER_AGREEMENTS}
          element={
            <ProtectedRoute>
              <AgreementDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={PAGE_ROUTES.OWNER_CREATE_AGREEMENT}
          element={
            <ProtectedRoute>
              <AgreementCreationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PAGE_ROUTES.TENANT_AGREEMENTS}
          element={
            <ProtectedRoute>
              <AgreementDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={PAGE_ROUTES.AGREEMENT_DETAIL}
          element={
            <ProtectedRoute>
              <AgreementDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
