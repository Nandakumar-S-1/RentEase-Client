import { useNavigate } from "react-router-dom";
import { Building2, UserRound, Home, ArrowLeft } from "lucide-react";
import { buildRoutes, PAGE_ROUTES } from "../../../config/routes";
import { RoleTypes } from "../../../types/constants/role.constant";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
          <Home className="h-5 w-5 text-primary" />
        </div>
        <span className="text-2xl font-bold text-primary">RentEase</span>
      </div>

      <button
        onClick={() => navigate(PAGE_ROUTES.HOME)}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      <div className="w-full max-w-xl rounded-2xl bg-card p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-primary">
          Join RentEase
        </h1>
        <p className="mb-8 text-center text-card-foreground">
          How would you like to use Rent Ease
        </p>

        <div className="flex gap-6 justify-center">
          <div
            onClick={() => navigate(buildRoutes.register(RoleTypes.OWNER_USER))}
            className="flex w-44 cursor-pointer flex-col items-center gap-3 rounded-xl bg-secondary p-6 transition-all hover:scale-105 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-secondary-foreground">
              I'm a Property Owner
            </h2>
            <p className="text-center text-xs text-muted-foreground">
              List and manage your rental Properties
            </p>
          </div>

          <div
            onClick={() =>
              navigate(buildRoutes.register(RoleTypes.TENANT_USER))
            }
            className="flex w-44 cursor-pointer flex-col items-center gap-3 rounded-xl bg-accent p-6 transition-all hover:scale-105 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <UserRound className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-accent-foreground">
              I'm Looking for Rental
            </h2>
            <p className="text-center text-xs text-muted-foreground">
              Find your Perfect Property to Rent
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <span className="text-sm text-muted-foreground">
            Already have an account?{" "}
          </span>
          <button
            onClick={() => navigate(PAGE_ROUTES.LOGIN)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
