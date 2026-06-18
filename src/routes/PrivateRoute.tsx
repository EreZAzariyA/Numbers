import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store";

interface PrivateRouteProps {
  element: React.JSX.Element;
};

const PrivateRoute = (props: PrivateRouteProps) => {
  const location = useLocation();
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to={'/auth/sign-in'} state={location} />
  }

  return props.element;
};

export default PrivateRoute;
