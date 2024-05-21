import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className=" min-h-screen flex justify-center items-center">
      <div className="bg-gray-200 rounded-md shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenido a Nuestra Plataforma de Solicitudes
        </h1>
        <p className="text-lg text-gray-900 mb-6">
          En nuestra plataforma, puede realizar solicitudes de manera eficiente
          y segura. Nos dedicamos a brindarle el mejor servicio posible.
        </p>
        <Link
          to="/login"
          className="bg-cyan-500 shadow-lg shadow-cyan-500/50 hover:bg-blue-800 text-white px-6 py-3 rounded-md inline-block"
          aria-label="Iniciar Sesión"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="bg-gray-500 shadow-lg shadow-gree500/50 hover:bg-gray-800 text-white px-6 py-3 rounded-md inline-block ml-4"
          aria-label="Registrarse"
        >
          Registrarse
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
