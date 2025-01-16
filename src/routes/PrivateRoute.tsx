import dayjs from "dayjs";
import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logoutAction } from "../redux/actions/auth-actions";

interface PrivateRouteProps {
  element: React.JSX.Element;
};

const PrivateRoute = (props: PrivateRouteProps) => {
  const location = useLocation();
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {

    if (token) {
      const decodedToken: { exp: number } = jwtDecode(token);
      const currentUnix = dayjs().unix();
      const tokenExpiry = decodedToken.exp;
      // const timeRemaining = tokenExpiry - currentUnix;

      if (currentUnix > tokenExpiry) {
        dispatch(logoutAction());
      }
    }
  }, [token, dispatch, location]);

  if (!token) {
    return <Navigate to={'/auth/sign-in'} state={location} />
  }

  return props.element;
};

export default PrivateRoute;