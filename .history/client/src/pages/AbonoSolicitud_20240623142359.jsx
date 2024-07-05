import React, { useState, useEffect } from "react";
import { Label } from "../components/ui";
import { useSoli } from "../context/SolicitudContext";
import "../css/solicitud.css";
import { useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export const AbonoSolicitud = () => {
    const { id: paramId } = useParams();
    const [myId, setMyId] = useState(paramId);
    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors },
    //   } = useForm();

    const [loading, setLoading] = useState(true);
    const [datosCargados, setDatosCargados] = useState(false);
    // const [datoCantAcumulado, setdatoCantAcumulado] = useState(false);

    const {
        unasoli,
        getunSolitud,
        myEntregaSoli,
    } = useSoli();

    const [fecha, setFecha] = useState(() => {
        const today = new Date().toISOString().split("T")[0]; 
        return today;
    });

    const [folio, setFolio] = useState("");
    const [folioExterno, setFolioExterno] = useState("");
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
                folioExterno,
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
    
            setItems(updatedItems); // Actualiza el estado de items con las cantidades acumuladas
    
        } catch (error) {
            console.error("Error al guardar los datos:", error);
        }
    };
    

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="formulariodatos">
            <div className="bg-white p-6 rounded-lg shadow-md border border-black">
                <h1 className="titulo border border-black">Area de Entregas</h1>
            </div>

            <div className="division"></div>
            <div className="body2">
                <div className="bg-white p-6 rounded-lg shadow-md border border-black w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <Label
                                htmlFor="folio"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                No. de folio:
                            </Label>
                            <input
                                type="text"
                                disabled
                                id="folio"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 cursor-not-allowed"
                                value={folio || ""}
                                onChange={(e) => setFolio(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="folioExterno"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                No. de folio externo:
                            </Label>
                            <input
                                type="text"
                                id="folioExterno"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                value={folioExterno || ""}
                                onChange={(e) => setFolioExterno(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="fecha"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Selecciona la fecha:
                            </Label>
                            <input
                                type="date"
                                disabled
                                id="fecha"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                value={fecha || ""}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </div>
                    </div>
                    {items.map((item, index) => (
                        <div key={index} className="space-y-4 mb-4">
                            <div className="flex flex-wrap space-x-4 mb-4">
                                <div className="flex-1 min-w-[150px]">
                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cantidad:
                                    </Label>
                                    <input
                                        type="number"
                                        placeholder="Ingrese una cantidad"
                                        className="Inputs w-full"
                                        disabled
                                        value={item.cantidad || ""}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].cantidad = e.target.value;
                                            setItems(newItems);
                                        }}
                                        required
                                    />
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Unidad de medida:
                                    </Label>
                                    <select
                                        className="Inputs w-full"
                                        value={item.unidad || ""}
                                        disabled
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
                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cantidad Acumulada:
                                    </Label>
                                    <input
                                        type="number"
                                        disabled
                                        className="Inputs w-full"
                                        value={item.cantidadAcumulada || ""}
                                    />
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cantidad a entregar:
                                    </Label>
                                    <input
                                        type="text"
                                        disabled={!datosCargados}
                                        className="Inputs w-full"
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
                                <Label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción:
                                </Label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese la descripción"
                                    disabled
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
                    <div className="flex justify-center mt-8 ">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
                            onClick={guardarDatos}
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};