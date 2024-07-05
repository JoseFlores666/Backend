import React, { useState, useEffect } from "react";
import { useSoli } from "../context/SolicitudContext";
import { useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export const AbonoSolicitud = () => {
    const { id: paramId } = useParams();
    const [myId, setMyId] = useState(paramId);

    const [loading, setLoading] = useState(true);
    const [datosCargados, setDatosCargados] = useState(false);
    // const [datoCantAcumulado, setdatoCantAcumulado] = useState(false);

    const {
        unasoli,
        getunSolitud,
        myEntregaSoli,
        // traeCantidadAcumulada,
        // cantidadAcumulada,
    } = useSoli();

    const [fecha, setFecha] = useState(() => {
        const today = new Date().toISOString().split("T")[0]; // Obtiene la parte de la fecha (yyyy-MM-dd)
        return today;
    });

    const [folio, setFolio] = useState("");
    const [justificacion, setJustificacion] = useState("");
    const [items, setItems] = useState([
        {
            cantidad: "",
            unidad: "",
            descripcion: "",
            cantidadAcumulada: "",
            cantidadEntregada: "",
        },
    ]);

    const llenarFormulario = () => {
        setJustificacion(unasoli.justificacionAdquisicion || "");
        setFolio(unasoli.folio || "");
        setFecha(
            unasoli.fecha ? new Date(unasoli.fecha).toISOString().slice(0, 10) : ""
        );
        setItems(
            unasoli.suministros || [
                {
                    cantidad: "",
                    unidad: "",
                    descripcion: "",
                },
            ]
        );
    };

    useEffect(() => {
        if (datosCargados) {
            llenarFormulario();
        }
    }, [datosCargados]);

    useEffect(() => {
        const cargarSolicitud = async () => {
            try {
                await getunSolitud(myId);
                setDatosCargados(true);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener la solicitud:", error);
            }
        };

        if (myId && loading) {
            cargarSolicitud();
        }
    }, [myId, loading, getunSolitud]);

    const limpiarDatos = () => {
        setItems((prevItems) => {
            return prevItems.map((item) => {
                return {
                    ...item,
                    cantidadEntregada: "", //limpia el campo
                };
            });
        });
    };

    const guardarDatos = async () => {
        if (items.some((item) => !item.cantidadEntregada)) {
            Swal.fire({
                title: "Alerta!",
                text: "Complete todos los componentes",
                icon: "warning",
                confirmButtonText: "Cool",
            });
            return;
        }

        try {
            // Calcular la cantidad total entregada y actualizar la cantidad acumulada
            const updatedItems = items.map((item) => {
                const cantidadEntregada = parseFloat(item.cantidadEntregada || 0);
                const cantidadAcumulada =
                    parseFloat(item.cantidadAcumulada || 0) + cantidadEntregada;
                const cantidadTotal = parseFloat(item.cantidad || 0);

                try {
                    if (cantidadEntregada + cantidadAcumulada > cantidadTotal) {
                        throw new Error("Cantidad excedida");
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: "La cantidad entregada y la cantidad acumulada no pueden superar la cantidad total permitida.",
                        icon: "error",
                        confirmButtonText: "Ok",
                    });
                    throw error;
                }

                return { ...item, cantidadAcumulada }; // Actualiza la cantidad acumulada en cada item
            });

            const soli = {
                justificacion,
                items: updatedItems,
            };

            await myEntregaSoli(myId, soli); // Envía los datos a la base de datos

            Swal.fire({
                title: "Completado!",
                text: "Abono Exitoso",
                icon: "success",
                confirmButtonText: "Cool",
            });

            setItems(updatedItems);
        } catch (error) {
            console.error("Error al guardar los datos:", error);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="mx-auto max-w-6xl p-4 text-black">
            <div >
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-black">Area de Entregas</h2>
                </div>
            </div>
            <div>
                <div className="grid grid-cols-2 gap-4 mb-6 text-black">
                    <div>
                        <label
                            htmlFor="folio"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            No. de folio:
                        </label>
                        <input
                            type="text"
                            disabled
                            id="folio"
                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            value={folio || ""}
                            onChange={(e) => setFolio(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="fecha"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Selecciona la fecha:
                        </label>
                        <input
                            type="date"
                            id="fecha"
                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            value={fecha || ""}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                </div>

                {items.map((item, index) => (
                    <div key={index} className="space-y-4 mb-4 col-span-2">
                        <div className="flex flex-wrap space-x-4 mb-4">
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cantidad:
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ingrese una cantidad"
                                    className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    value={item.cantidad || ""}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].cantidad = e.target.value;
                                        setItems(newItems);
                                    }}
                                    required
                                />
                            </div>
                            <div className=" flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium mb-1">
                                    Unidad de medida:
                                </label>
                                <select
                                    className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    value={item.unidad || ""}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].unidad = e.target.value;
                                        setItems(newItems);
                                    }}
                                    required
                                >
                                    <option value="">Unidad</option>
                                    <option value="Paquete">Paquete</option>
                                    <option value="Rollo">Rollo</option>
                                    <option value="Caja">Caja</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium mb-1">
                                    Cantidad Acumulada:
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    value={item.cantidadAcumulada || ""}
                                />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium mb-1">
                                    Cantidad a entregar:
                                </label>
                                <input
                                    type="text"
                                    disabled={!datosCargados}
                                    className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    value={item.cantidadEntregada || ""}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].cantidadEntregada = e.target.value;
                                        setItems(newItems);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción:
                            </label>
                            <textarea
                                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ingrese la descripción"
                                value={item.descripcion || ""}
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[index].descripcion = e.target.value;
                                    setItems(newItems);
                                }}
                                required
                            ></textarea>
                        </div>
                    </div>
                ))}
                <div className="flex justify-center mt-8">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-md border border-black"
                        onClick={guardarDatos}
                    >
                        Actualizar
                    </button>
                </div>
            </div>
        </div>

    );
};