import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";

interface PrivateRouteProps {
  element: React.JSX.Element;
};

const PrivateRoute = (props: PrivateRouteProps) => {
  const location = useLocation();
  const { token } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to={'/auth/sign-in'} state={location} />
  }

  return props.element;
};

export default PrivateRoute;