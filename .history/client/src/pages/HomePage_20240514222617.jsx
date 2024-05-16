import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="rgb(32, 32, 32) min-h-screen flex justify-center items-center">
      <div className="rgb(175 175 212) p-10 rounded-md shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenido a Nuestra Plataforma de Solicitudes
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          En nuestra plataforma, puede realizar solicitudes de manera eficiente
          y segura. Nos dedicamos a brindarle el mejor servicio posible.
        </p>
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md inline-block"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-md inline-block ml-4"
        >
          Registrarse
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
