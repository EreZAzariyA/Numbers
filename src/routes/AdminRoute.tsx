import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store";

interface AdminRouteProps {
  element: React.JSX.Element;
}

const AdminRoute = ({ element }: AdminRouteProps) => {
  const location = useLocation();
  const { token, user } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/auth/sign-in" state={location} />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default AdminRoute;
