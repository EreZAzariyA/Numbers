import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardView from "../layout";
import AuthView from "../layout/AuthView";
import Invoices from "../components/invoices";
import Dashboard from "../components/dashboard";
import SignIn from "../components/auth/sign-in";
import SignUp from "../components/auth/sign-up";
import store from "../redux/store";
import CategoriesPage from "../components/categories";

const UserRouter = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={'/dashboard'} />} />
        <Route element={<DashboardView />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/profile" element={<p>profile</p>} />
          <Route path="/search" element={<p>search</p>} />

          <Route path="page-not-found" element={<p>Page not found</p>} />
          <Route path="*" element={<Navigate to={'page-not-found'} replace />} />
        </Route>

        <Route path="/auth" element={<AuthView />}>
          <Route path="/auth" element={<Navigate to={'login'} replace />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />

          <Route path="page-not-found" element={<p>Page not found</p>} />
          <Route path="*" element={<Navigate to={'page-not-found'} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);

export default UserRouter;