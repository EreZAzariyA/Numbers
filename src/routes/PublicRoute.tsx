import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";

interface PublicRouteProps {
  children: React.JSX.Element
};

const PublicRoute = (props: PublicRouteProps) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!!user) {
    return <Navigate to={'/'} state={location} />
  }

  return props.children;
};

export default PublicRoute;