import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store";

interface PublicRouteProps {
  element: React.JSX.Element
};

const PublicRoute = (props: PublicRouteProps) => {
  const location = useLocation();
  const { token } = useAppSelector((state) => state.auth);

  if (!!token) {
    return <Navigate to={'/'} state={location} />
  }

  return props.element;
};

export default PublicRoute;