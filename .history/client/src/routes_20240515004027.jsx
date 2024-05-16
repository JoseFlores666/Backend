import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";

//este verifica si el usuario esta autenticado para
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;
  return <Outlet />;
};
