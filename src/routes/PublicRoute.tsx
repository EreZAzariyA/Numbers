import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";

interface PublicRouteProps {
  children: React.JSX.Element
};

const PublicRoute = (props: PublicRouteProps) => {
  const location = useLocation();
  const { token, loading } = useSelector((state: RootState) => state.auth);

  if (token) {
    return <Navigate to={'/'} state={location} />
  }
  if (loading) {
    return <Spin />
  }

  return props.children;
};

export default PublicRoute;