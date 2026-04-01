import { Routes, Route } from "react-router-dom";
import { UserRouter } from "./UserRouter";
import { AdminRouter } from "./AdminRouter";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="*" element={<UserRouter />} />
    </Routes>
  );
};
