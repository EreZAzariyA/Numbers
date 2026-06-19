import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const DashboardView = lazy(() => import("../layout"));
const AuthRoot = lazy(() => import("../components/auth/AuthRoot"));
const SignIn = lazy(() => import("../components/auth/sign-in"));
const SignUp = lazy(() => import("../components/auth/sign-up"));
const Dashboard = lazy(() => import("../components/dashboard"));
const Transactions = lazy(() => import("../components/transactions"));
const CategoriesPage = lazy(() => import("../components/categories"));
const Profile = lazy(() => import("../components/profile"));
const PageNotFound = lazy(() => import("../components/components/PageNotFound"));
const BankPage = lazy(() => import("../components/bank-page"));
const LoansSavingsPage = lazy(() => import("../components/loans-savings"));
const RecurringTransactions = lazy(() => import("../components/recurring"));
const SavingsGoalsPage = lazy(() => import("../components/savings-goals"));
const CashFlowPage = lazy(() => import("../components/cash-flow"));

const routeFallback = (
  <div aria-busy="true" style={{ minHeight: 160 }}>
    <Spin />
  </div>
);

const withSuspense = (element: ReactNode) => (
  <Suspense fallback={routeFallback}>
    {element}
  </Suspense>
);

const dashboardRoutes: RouteObject[] = [
  {
    path: "/",
    element: withSuspense(<PrivateRoute element={<DashboardView />} />),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: withSuspense(<Dashboard />),
      },
      {
        path: "transactions",
        element: withSuspense(<Transactions />),
      },
      {
        path: "categories",
        element: withSuspense(<CategoriesPage />),
      },
      {
        path: "bank",
        element: withSuspense(<BankPage />),
      },
      {
        path: "loans-savings",
        element: withSuspense(<LoansSavingsPage />),
      },
      {
        path: "recurring",
        element: withSuspense(<RecurringTransactions />),
      },
      {
        path: "savings-goals",
        element: withSuspense(<SavingsGoalsPage />),
      },
      {
        path: "cash-flow",
        element: withSuspense(<CashFlowPage />),
      },
      {
        path: "profile",
        element: withSuspense(<Profile />),
      },
      {
        path: "*",
        element: withSuspense(<PageNotFound />),
      },
    ],
  }
];
const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: withSuspense(<AuthRoot />),
    children: [
      {
        index: true,
        element: <Navigate to="sign-in" replace />,
      },
      {
        path: "sign-in",
        element: withSuspense(<SignIn />),
      },
      {
        path: "sign-up",
        element: withSuspense(<SignUp />),
      },
      {
        path: "*",
        element: withSuspense(<PageNotFound />),
      },
    ],
  },
];

export const routes = createBrowserRouter([
  ...dashboardRoutes,
  ...authRoutes,
]);
