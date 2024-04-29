import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, useLocation } from "react-router-dom";

interface PublicRouteProps {
  children: React.JSX.Element
};

const PublicRoute = (props: PublicRouteProps) => {
  let location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) {
    return <Navigate to={'/'} state={location} />
  }

  return props.children
};

export default PublicRoute;