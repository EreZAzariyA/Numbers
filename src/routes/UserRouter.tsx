import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import DashboardView from "../layout";
import AuthView from "../layout/AuthView";
import SignIn from "../components/auth/sign-in";
import SignUp from "../components/auth/sign-up";
import Dashboard from "../components/dashboard";
import Transactions from "../components/transactions";
import CategoriesPage from "../components/categories";
import Profile from "../components/profile";
import PageNotFound from "../components/components/PageNotFound";
import BankPage from "../components/bank-page";

const UserRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PrivateRoute element={<DashboardView />} /> }>
        <Route index element={<Navigate to={'/dashboard'} replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="bank" element={<BankPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="page-not-found" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to={'page-not-found'} replace />} />
      </Route>

      <Route path="/auth" element={<PublicRoute element={<AuthView />} />}>
        <Route index element={<Navigate to={'sign-in'} replace />} />
        <Route path="sign-in" element={<PublicRoute element={<SignIn />} />} />
        <Route path="sign-up" element={<PublicRoute element={<SignUp />} />} />
        <Route path="*" element={<Navigate to={'sign-in'} replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default UserRouter;