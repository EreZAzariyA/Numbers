import { GoogleOAuthProvider } from "@react-oauth/google";
import PublicRoute from "../../routes/PublicRoute";
import AuthView from "../../layout/AuthView";

const AuthRoot = () => (
  <PublicRoute
    element={(
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}>
        <AuthView />
      </GoogleOAuthProvider>
    )}
  />
);

export default AuthRoot;
