import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ButtonLink } from "./ui/ButtonLink";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  // Para cerrar sesión
  function recargarPagina() {
    window.location.reload();
  }

  return (
    <div>
      <nav className="bg-zinc-700 my-3 lg:my-6 px-5 lg:px-10 rounded-lg flex flex-wrap py-5 items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl lg:text-3xl font-bold mr-4">
            <Link to={isAuthenticated ? "/soli" : "/"}>Solicitudes INEGO</Link>
          </h1>
          <button className="lg:hidden focus:outline-none">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col lg:flex-row lg:gap-x-2 lg:items-center lg:flex-wrap">
          {isAuthenticated ? (
            <>
              <li className="text-xl lg:text-1x2 font-bold mr-4 mb-2 lg:mb-0">
                Bienvenido: {user.username}
              </li>
              <li className="text-xl lg:text-1x2 font-bold mr-4 mb-2 lg:mb-0">
                <ButtonLink to="/tecnico">Registrar Informe</ButtonLink>
              </li>
              <li className="text-xl lg:text-1x2 font-bold mr-4 mb-2 lg:mb-0">
                <ButtonLink to="/soliPager">Solicitudes</ButtonLink>
              </li>
              <li className="text-xl lg:text-1x2 font-bold mr-4 mb-2 lg:mb-0">
                <ButtonLink to="/soli">Registrar Solicitud</ButtonLink>
              </li>
              <li>
                <Link
                  to="/"
                  onClick={recargarPagina}
                  className="text-xl lg:text-2xl font-bold"
                >
                  Cerrar Sesión
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="text-xl lg:text-2xl font-bold mr-4 mb-2 lg:mb-0">
                <ButtonLink to="/login">Iniciar Sesión</ButtonLink>
              </li>
              <li className="text-xl lg:text-2xl font-bold mr-4 mb-2 lg:mb-0">
                <ButtonLink to="/register">Registrarse</ButtonLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      {/* Menú adicional */}
      <nav className="bg-gray-200 py-3 px-5 rounded-lg flex justify-between">
        <ul className="flex gap-x-4">
          <li>
            <ButtonLink to="/menu1">Menú 1</ButtonLink>
          </li>
          <li>
            <ButtonLink to="/menu2">Menú 2</ButtonLink>
          </li>
          {/* Agrega más elementos de menú según sea necesario */}
        </ul>
        <div>
          <span>Menú adicional</span>
        </div>
      </nav>
    </div>
  );
}
