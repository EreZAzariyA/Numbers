import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import store from "../redux/store";
import DashboardView from "../layout";
import AuthView from "../layout/AuthView";
import SignIn from "../components/auth/sign-in";
import SignUp from "../components/auth/sign-up";
import Dashboard from "../components/dashboard";
import Invoices from "../components/invoices";
import CategoriesPage from "../components/categories";
import { GoogleOAuthProvider } from '@react-oauth/google';
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Profile from "../components/profile";
import PageNotFound from "../components/components/PageNotFound";
import BankPage from "../components/bank-page";

const UserRouter = () => (
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={'/dashboard'} />} />
          <Route element={<PrivateRoute><DashboardView /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/bank" element={<BankPage />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="page-not-found" element={<PageNotFound />} />
            <Route path="*" element={<Navigate to={'page-not-found'} replace />} />
          </Route>

          <Route path="/auth" element={<PublicRoute><AuthView /></PublicRoute>}>
            <Route path="/auth" element={<Navigate to={'sign-in'} replace />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />

            <Route path="page-not-found" element={<p>Page not found</p>} />
            <Route path="*" element={<Navigate to={'page-not-found'} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);

export default UserRouter;