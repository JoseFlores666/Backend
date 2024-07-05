import React, { useState, useEffect } from "react";
import { Label } from "../components/ui";
import { useSoli } from "../context/SolicitudContext";
import "../css/solicitud.css";
import { useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export const AbonoSolicitud = () => {
    const { id } = useParams();
    const location = useLocation();
    const [solicitante, setSolicitante] = useState('');
    const [jefeInmediato, setJefeInmediato] = useState('');
    const [direccion, setDireccion] = useState('');
    const [rectoria, setRectoria] = useState('');
    const [folio, setFolio] = useState('');
    const [fecha, setFecha] = useState('');
    const [items, setItems] = useState([]);
    const [datosCargados, setDatosCargados] = useState(false);

    useEffect(() => {
        // Lógica para cargar datos iniciales si es necesario
    }, [id, location]);

    const guardarDatos = () => {
        // Lógica para guardar datos
        Swal.fire("Datos guardados", "", "success");
    };

    return (
        <div className="formulariodatos">
            <div className="bg-white p-6 rounded-lg shadow-md border border-black">
                <h1 className="titulo border border-black">Area de Entregas</h1>
            </div>

            <div className="division"></div>
            <div className="body2">


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
                                            name="solicitud"
                                            value={solicitante || ""}
                                            onChange={(e) => setSolicitante(e.target.value)}
                                            required
                                        />
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
                                            name="JefeInmediato"
                                            value={jefeInmediato || ""}
                                            onChange={(e) => setJefeInmediato(e.target.value)}
                                            required
                                        />
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
                                            name="Validacion"
                                            value={direccion || ""}
                                            onChange={(e) => setDireccion(e.target.value)}
                                            required
                                        />
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
                                            name="Autorizo"
                                            value={rectoria || ""}
                                            onChange={(e) => setRectoria(e.target.value)}
                                            required
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-center mt-8">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
                        onClick={guardarDatos}
                    >
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
      
      
    );
};
