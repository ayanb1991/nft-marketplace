import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import FullPageLoader from "./loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
