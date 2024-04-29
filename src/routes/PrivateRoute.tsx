import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, useLocation } from "react-router-dom";
import authServices from "../services/authentication";
import { isAdmin } from "../utils/helpers";
import { Button } from "antd";

interface PrivateRouteProps {
  children: React.JSX.Element
};

const PrivateRoute = (props: PrivateRouteProps) => {
  let location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  const logout = (): void => {
    authServices.logout();
  };
  
  if (!user) {
    return <Navigate to={'/auth/sign-in'} state={location} />
  }
  else if (user && isAdmin(user)) {
    <>
      <p style={{ textTransform: 'capitalize'}}>you are not in the correct url</p>
      <Button danger onClick={logout}>Logout</Button>
    </>
  }

  return props.children
};

export default PrivateRoute;