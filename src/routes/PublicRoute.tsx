import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";

interface PublicRouteProps {
  element: React.JSX.Element
};

const PublicRoute = (props: PublicRouteProps) => {
  const location = useLocation();
  const { token } = useSelector((state: RootState) => state.auth);

  if (!!token) {
    return <Navigate to={'/'} state={location} />
  }

  return props.element;
};

export default PublicRoute;