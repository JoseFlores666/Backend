import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { firmasSchema } from "../schemas/Firmas"; // Asegúrate de tener definido este esquema en tu proyecto
import "../css/solicitud.css";
import { useSoli } from "../context/SolicitudContext";

export const Firmas = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(firmasSchema),
  });

  const { editarFirmas, getFirmas, nombresFirmas } = useSoli(); // Obtiene la función editarFirmas del contexto
  const [esperarFirmas, setEsperarFirmas] = useState(false);

  useEffect(() => {
    try {
    } catch (error) {
      console.error("Error al consultar las firmas:", error);
      Swal.fire("Error al guardar los datos", "", "error"); // Muestra un mensaje de error si falla la solicitud
    }, [editar, unasoli]);

  const guardarDatos = async (data) => {
    console.log("Datos guardados:", data);
    try {
      await editarFirmas(data); // Llama a la función editarFirmas del contexto con datosActualizados
      Swal.fire("Datos guardados", "", "success"); // Muestra un mensaje de éxito usando SweetAlert2
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      Swal.fire("Error al guardar los datos", "", "error"); // Muestra un mensaje de error si falla la solicitud
    }
  };


  return (
    <div className="formulariodatos">
      <div className="bg-white p-6 rounded-lg shadow-md border border-black">
        <h1 className="titulo border border-black">Editar Nombres</h1>
      </div>
      <div className="division"></div>
      <div className="body2">
        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
          <form onSubmit={handleSubmit(guardarDatos)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              <div className="columna">
                <table className="mi-tabla w-full">
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="solicitud">Solicitud</label>
                      </td>
                    </tr>
                    <tr className="fila-grande">
                      <td>
                        <input
                          type="text"
                          className="Inputs w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          id="solicitud"
                          name="solicitante"
                          {...register("solicitante")}
                          required
                        />
                        {errors.solicitante && (
                          <p className="text-red-500">{errors.solicitante.message}</p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="columna">
                <table className="mi-tabla w-full">
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="JefeInmediato">Revisión</label>
                      </td>
                    </tr>
                    <tr className="fila-grande">
                      <td>
                        <input
                          type="text"
                          className="Inputs w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          id="JefeInmediato"
                          name="jefeInmediato"
                          {...register("jefeInmediato")}
                          required
                        />
                        {errors.jefeInmediato && (
                          <p className="text-red-500">{errors.jefeInmediato.message}</p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="columna">
                <table className="mi-tabla w-full">
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="Validacion">Validación</label>
                      </td>
                    </tr>
                    <tr className="fila-grande">
                      <td>
                        <input
                          type="text"
                          className="Inputs w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          id="Validacion"
                          name="direccion"
                          {...register("direccion")}
                          required
                        />
                        {errors.direccion && (
                          <p className="text-red-500">{errors.direccion.message}</p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="columna">
                <table className="mi-tabla w-full">
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="Autorizo">Autorizó</label>
                      </td>
                    </tr>
                    <tr className="fila-grande">
                      <td>
                        <input
                          type="text"
                          className="Inputs w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          id="Autorizo"
                          name="rectoria"
                          {...register("rectoria")}
                          required
                        />
                        {errors.rectoria && (
                          <p className="text-red-500">{errors.rectoria.message}</p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 px-6 py-3 rounded-md border border-black"
              >
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
