import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";

interface PrivateRouteProps {
  children: React.JSX.Element
};

const PrivateRoute = (props: PrivateRouteProps) => {
  const location = useLocation();
  const { token, loading } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to={'/auth/sign-in'} state={location} />
  }
  if (loading) {
    return <Spin />
  }

  return props.children;
};

export default PrivateRoute;