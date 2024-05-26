import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.JSX.Element
};

const PrivateRoute = (props: PrivateRouteProps) => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to={'/auth/sign-in'} state={location} />
  }

  return props.children
};

export default PrivateRoute;