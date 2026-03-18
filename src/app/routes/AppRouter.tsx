import { Routes, Route } from "react-router-dom";
import { UserRouter } from "./UserRouter";
import { AdminRouter } from "./AdminRouter";

export const AppRouter = () => {
  return (
    <Routes>
{/* adminside */}
      <Route path="/admin/*" element={<AdminRouter />} />

{/* user rotus   */}
      <Route path="/*" element={<UserRouter />} />
    </Routes>
  );
};
