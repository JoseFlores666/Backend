import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";

//este verifica si el usuario esta autenticado para proteger las paginas
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <h1>Loading...</h1>;

  //Si no esta autenticado(inicio sesion)
  if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;
  return <Outlet />;
};
