import React, { useEffect, useState } from "react";
import { useSoli } from "../context/SolicitudContext";
import "../css/solicitud.css";
import { Label } from "../components/ui";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export const RegisterSolicitudPage = () => {
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [titulo, setTitulo] = useState("Registrar Solicitud");
  const { id } = useParams();
  const editar = new URLSearchParams(location.search).get("editar");
  // const [folio, setFolio] = useState("");
  const [folioExterno, setFolioExterno] = useState("");

  const [suministro, setSuministro] = useState("");
  const [pc, setPc] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [actividad, setActividad] = useState(""); //
  const [nombreActividad, setNombreActividad] = useState(""); //
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

  const [projectsLoaded, setProjectsLoaded] = useState(false);
  // const [proyectLoaded, setProyectLoaded] = useState(false);
  const [fetchActivitiesFlag, setFetchActivitiesFlag] = useState(false);
  const [fetchPDFFlag, setFetchPDFFlag] = useState(false);
  const [solicitudLoaded, setSolicitudLoaded] = useState(false);

  const [cantidadAcumulada, setCantidadAcumulada] = useState(""); // Nuevo campo oculto 1
  const [cantidadEntregada, setcantidadEntregada] = useState(""); // Nuevo campo oculto 2

  const {
    crearmySoli,
    getIdsProyect,
    ids,
    getIdsProyectYAct,
    idsAct = [],
    proyect,
    act,
    unasoli,
    unProyectAct,
    actializarSoli,
    getunSolitud,
    getIdsProyectYActIndividual,
  } = useSoli();

  const [datos, setDatos] = useState({
    fecha: "",
    suministro: "",
    pc: "",
    proyecto: "",
    actividad: "",
    justificacion: "",
    items: [],
  });

  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("datosSolicitud"));
    if (datosGuardados) {
      setDatos(datosGuardados);
    }
  }, []);

  useEffect(() => {
    (document.title =
      id && editar === "true" ? "Actualizar Solicitud" : "Registrar Solicitud"),
      limpiarDatos();
    return () => {
      document.title = "Solicitudes INNEGO";
    };
  }, [id]);

  const fetchSolicitud = async (id) => {
    try {
      if (id) {
        await getunSolitud(id);
        setSolicitudLoaded(true);
      }
    } catch (error) {
      console.error("Error al obtener la solicitud:", error);
    }
  };

  //editar
  useEffect(() => {
    if (editar && unasoli) {
      setFolioExterno(unasoli.folio || "");
      setFecha(
        unasoli.fecha ? new Date(unasoli.fecha).toISOString().slice(0, 10) : ""
      );
      setSuministro(unasoli.tipoSuministro || "");
      setPc(unasoli.procesoClave || "");
      setProyecto(unasoli.proyecto || "");
      setActividad(unasoli.actividades || "");
      setJustificacion(unasoli.justificacionAdquisicion || "");
      setItems(
        unasoli.suministros || [
          {
            cantidad: "",
            unidad: "",
            descripcion: "",
          },
        ]
      );
      getIdsProyectYAct(unasoli.proyecto);
    }
  }, [editar, unasoli]);

  //editar
  useEffect(() => {
    if (id && editar === "true" && !solicitudLoaded) {
      fetchSolicitud(id);
    }
  }, [id, editar, solicitudLoaded]);

  const agregarItem = (e) => {
    e.preventDefault(); // Prevenir el envío del formulario
    if (items.length < 10) {
      setItems([...items, { cantidad: "", unidad: "", descripcion: "" }]);
    } else {
      alert("No se pueden agregar más de 10 items.");
    }
  };

  const eliminarItem = (index, e) => {
    e.preventDefault(); // Prevenir el envío del formulario
    setItems(items.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        await getIdsProyectYAct(proyecto);
        setFetchActivitiesFlag(false);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    if (fetchActivitiesFlag) {
      fetchActivities();
    }
  }, [fetchActivitiesFlag, proyecto, getIdsProyectYAct]);

  useEffect(() => {
    const bucarNombreProyectoActividad = async () => {
      if (proyecto && actividad) {
        console.log(proyecto, "Este es mi proyecto " + actividad);
        try {
          await getIdsProyectYActIndividual(proyecto, actividad);
          console.log("Proyecto:" + proyect + "  Actividad:" + act);
          setFetchPDFFlag(false);
        } catch (error) {
          console.error(
            "Error al obtener información del proyecto y la actividad:",
            error
          );
        }
      }
    };
    if (fetchPDFFlag) {
      bucarNombreProyectoActividad();
    }
  }, [proyecto, actividad, fetchPDFFlag, getIdsProyectYActIndividual]);

  useEffect(() => {
    const llenarFormularioActualizar = async () => {
      if (!projectsLoaded) {
        try {
          await getIdsProyect();
          setProjectsLoaded(true);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };
    llenarFormularioActualizar();
  }, [projectsLoaded, getIdsProyect]);

  const limpiarDatos = () => {
    setFolioExterno("");
    setFecha(() => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    });
    setSuministro("");
    setPc("");
    setActividad("");
    setProyecto("");
    setJustificacion("");
    setItems("");
    setItems([
      {
        cantidad: "",
        unidad: "",
        descripcion: "",
        cantidadAcumulada: "",
        cantidadEntregada: "",
      },
    ]);
  };

  const actualizarDatos = () => {
    if (
      !folioExterno ||
      !fecha ||
      !suministro ||
      !pc ||
      !proyecto ||
      !actividad ||
      !justificacion ||
      items.length === 0 ||
      items.some((item) => !item.unidad || !item.cantidad || !item.descripcion)
    ) {
      Swal.fire({
        title: "Alerta!",
        text: "Complete todos los componentes",
        icon: "warning",
        confirmButtonText: "Cool",
      });
      return;
    }

    const datosSolicitud = {
      id,
      folioExterno,
      fecha,
      suministro,
      pc,
      proyecto,
      actividad,
      justificacion,
      items: items,
    };

    actializarSoli(id, datosSolicitud);

    Swal.fire({
      title: "Completado!",
      text: "Actualización Exitosa",
      icon: "success",
      confirmButtonText: "Cool",
    });
  };

  return (
    <div className="formulariodatos">
      <form method="post" action="http://localhost/Tutorial2_OpentbsWordPHP-master/formSoli.php">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-black">
            <h1 className="titulo border border-black">
              {editar ? "Actualizar Solicitud" : "Registrar Solicitud"}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <Label htmlFor="folio" className="block text-sm font-medium text-gray-700 mb-1">
                  No. de folio:
                </Label>
                <input
                  type="text"
                  id="folio"
                  name="folio"
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={folioExterno || ""}
                  onChange={(e) => setFolioExterno(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                  Selecciona la fecha:
                </Label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={fecha || ""}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Suministro:
                </Label>
                <select
                  id="Suministro"
                  name="suministro"
                  value={suministro || ""}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setSuministro(e.target.value)}
                >
                  <option value="">Seleccione un suministro</option>
                  <option value="Normal">Normal</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Proceso Clave (PC):
                </Label>
                <select
                  id="PC"
                  name="pc"
                  value={pc || ""}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setPc(e.target.value)}
                >
                  <option value="">Seleccione el PC</option>
                  <option value="Educativo">PC Educativo</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Proyecto:
                </Label>
                <select
                  id="Proyecto"
                  name="proyecto"
                  value={proyecto || ""}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => {
                    setProyecto(e.target.value);
                    console.log("Proyecto seleccionado:", e.target.value);
                    setFetchActivitiesFlag(true);
                  }}
                >
                  <option value="">Seleccione el Proyecto</option>
                  {ids.map((proyecto) => (
                    <option key={proyecto._id} value={proyecto._id}>
                      {proyecto.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Actividad:
                </Label>
                <select
                  id="Actividad"
                  name="actividad"
                  value={actividad || ""}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => {
                    setActividad(e.target.value);
                    console.log("actividad seleccionado:", e.target.value);
                    setFetchPDFFlag(true);
                  }}
                >
                  <option value="">Seleccione una Actividad</option>
                  {idsAct.map((actividad) => (
                    <option key={actividad._id} value={actividad._id}>
                      {actividad.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-black border border-black">
            {items.map((item, index) => (
              <div key={index} className="division">
                <div className="labelsContainer flex-1">
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad:
                  </Label>
                  <input
                    type="number"
                    name={items[${index}][cantidad]}
                    placeholder="Ingrese una cantidad"
                    className="Inputs"
                    value={item.cantidad || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].cantidad = e.target.value;
                      setItems(newItems);
                    }}
                  />
                </div>
                <div className="labelsContainer flex-1">
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad de medida:
                  </Label>
                  <select
                    name={items[${index}][unidad]}
                    className="Inputs2"
                    value={item.unidad || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].unidad = e.target.value;
                      setItems(newItems);
                    }}
                  >
                    <option value="">Unidad</option>
                    <option value="Paquete">Paquete</option>
                    <option value="Rollo">Rollo</option>
                    <option value="Caja">Caja</option>
                  </select>
                </div>
                <div className="labelsContainer flex-1">
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del bien solicitado:
                  </Label>
                  <textarea
                    name={items[${index}][descripcion]}
                    className="w-full max-w-5x1 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ingrese la descripción"
                    value={item.descripcion || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].descripcion = e.target.value;
                      setItems(newItems);
                    }}
                  ></textarea>
                </div>
                <div className="flex flex-col items-center">
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Acción:
                  </Label>
                  <button
                    className="btn max-w-4xl bg-red-500 hover:bg-red-600 text-white font-bold mt-2 md:mt-0 py-2 px-5 rounded border border-black"
                    onClick={(e) => eliminarItem(index, e)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
                onClick={agregarItem}
              >
                Agregar Item
              </button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-black">
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Justificación para la adquisición:
            </Label>
            <textarea
              name="justificacion"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              id="Justificacion"
              value={justificacion || ""}
              onChange={(e) => setJustificacion(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
              type="submit"
            >
              {editar ? "Actualizar" : "Guardar cambios"}
            </button>
          </div>
          
        </div>
      </form>
    </div>

  );
};