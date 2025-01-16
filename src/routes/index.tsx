import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
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

const dashboardRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PrivateRoute element={<DashboardView />} />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "bank",
        element: <BankPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  }
];
const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <PublicRoute element={<AuthView />} />,
    children: [
      {
        index: true,
        element: <Navigate to="sign-in" replace />,
      },
      {
        path: "sign-in",
        element: <PublicRoute element={<SignIn />} />,
      },
      {
        path: "sign-up",
        element: <PublicRoute element={<SignUp />} />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
];

export const routes = createBrowserRouter([
  ...dashboardRoutes,
  ...authRoutes,
]);