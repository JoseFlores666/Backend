import React, { useEffect, useState } from "react";
import { useSoli } from "../context/SolicitudContext";
import "../css/solicitud.css";
import { Label } from "../components/ui";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export const RegisterSolicitudPage = () => {
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });


  const { id } = useParams();
  const editar = new URLSearchParams(location.search).get("editar");
  const [folioInterno, setFolioInterno] = useState("");

  const [suministro, setSuministro] = useState("");
  const [pc, setPc] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [actividad, setActividad] = useState(""); //
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
  const [fetchActivitiesFlag, setFetchActivitiesFlag] = useState(false);
  const [solicitudLoaded, setSolicitudLoaded] = useState(false);
  const [fetchPDFFlag, setFetchPDFFlag] = useState(false);

  const [myProyecto_, setMyProyecto_] = useState("");
  const [myActividad_, setMyActividad_] = useState("");

  const [banderaFirmas, setBanderaFirmas] = useState(false);
  const [solicitante, setSolicitante] = useState("");
  const [jefeInmediato, setJefeInmediato] = useState("");
  const [Dirrecion, setDirrecion] = useState("");
  const [Rectoría, setRectoría] = useState("");



  const {
    crearmySoli,
    getIdsProyect,
    ids,
    getIdsProyectYAct,
    idsAct = [],
    unasoli,
    unProyectAct,
    traeFolioInterno,
    myFolioInterno,
    actializarSoli,
    getunSolitud,
    getFirmas,
    nombresFirmas, getDescargaExterna
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
      setFolioInterno(unasoli.folio || "");
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

  useEffect(() => {
    if (nombresFirmas.length > 0) {
      const { solicitud, revision, validacion, autorizacion } = nombresFirmas[0];
      setSolicitante(solicitud);
      setJefeInmediato(revision);
      setDirrecion(validacion);
      setRectoría(autorizacion);
    }
    setFolioInterno(myFolioInterno)
  }, [editar, unasoli, nombresFirmas]);

  //editar
  useEffect(() => {
    if (id && editar === "true" && !solicitudLoaded) {
      fetchSolicitud(id);
    } else {

    }
  }, [id, editar, solicitudLoaded]);

  const agregarItem = (e) => {
    e.preventDefault();
    if (items.length < 10) {
      setItems([...items, { cantidad: "", unidad: "", descripcion: "" }]);
    } else {
      alert("No se pueden agregar más de 10 items.");
    }
  };

  const eliminarItem = (index, e) => {
    e.preventDefault();
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
    const llenaFirmas = async () => {
      try {
        await traeFolioInterno()
        await getFirmas()
        setBanderaFirmas(true);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    if (!banderaFirmas) {
      llenaFirmas();
    }
  }, [banderaFirmas, getFirmas]);

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

    setTimeout(() => {
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
        },
      ]);
      setBanderaFirmas("")
      setSolicitante("")
      setJefeInmediato("")
      setDirrecion("")
      setRectoría("")

    }, 3000);
  };

  const actualizarDatos = () => {
    if (
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

  const guardarDatos = () => {
    //validaciones
    if (
      !fecha ||
      !suministro ||
      !pc ||
      !proyecto ||
      !actividad ||
      !justificacion ||
      items.length === 0 ||
      items.some((item) => !item.unidad || !item.cantidad || !item.descripcion)
    ) {
      //alerta
      Swal.fire({
        title: "Alerta!",
        text: "Complete todos los componentes",
        icon: "warning",
        confirmButtonText: "Cool",
      });
      return;
    }
    const fetchProyecto = async () => {

      try {
        const datosSolicitud = {

          fecha,
          suministro,
          pc,
          proyecto,
          actividad,
          justificacion,
          items,
        };
        setDatos(datosSolicitud);
        console.log(datosSolicitud);
        crearmySoli(datosSolicitud);


        // limpiarDatos();
        localStorage.setItem("datosSolicitud", JSON.stringify(datosSolicitud));

        Swal.fire({
          title: "Completado!",
          text: "Registro Exitosa",
          icon: "success",
          confirmButtonText: "Cool",
        });

      } catch (error) {
        console.error("Error fetching activities:", error);
        alert("Error al guardar los datos.");
      }
    };
    fetchProyecto();


  };
  const handleProyectoChange = (e) => {
    const selectedProyectoId = e.target.value;
    setProyecto(selectedProyectoId);

    const selectedProyecto = ids.find(
      (proyecto) => proyecto._id === selectedProyectoId
    );
    console.log(selectedProyecto ? selectedProyecto.nombre : "");
    setMyProyecto_(selectedProyecto ? selectedProyecto.nombre : "");
    setFetchActivitiesFlag(true);
  };

  const handleChangeActividad = (e) => {
    const selectedActividadId = e.target.value;
    setActividad(selectedActividadId);
    const selectedActividad = idsAct.find(
      (actividad) => actividad._id === selectedActividadId
    );
    console.log(selectedActividad ? selectedActividad.nombre : "");
    setMyActividad_(selectedActividad ? selectedActividad.nombre : "");
    setFetchPDFFlag(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const response = await fetch('http://localhost/Tutorial2_OpentbsWordPHP-master/formSoli.php', {
        method: 'POST',
        body: formData
      });

      // if (!response.ok) {
      //   throw new Error('Error en la solicitud');
      // }

      // setTimeout(async () => {
      //   try {
      //     await getDescargaExterna();
      //   } catch (error) {
      //     console.error("Error al descargar el archivo:", error);
      //   }
      // }, 100);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <div className="formulariodatos">
      <form method="post" target="_eblank" onSubmit={handleSubmit}>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-black">
            <h1 className="titulo border border-black">
              {editar ? "Actualizar Solicitud" : "Registrar Solicitud"}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label
                  htmlFor="folioInterno"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Folio Interni:
                </label>
                <input
                  type="text"
                  id="folioInterno"
                  name="folioInterno"
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={folioInterno || ""}
                  onChange={(e) => setFolioInterno(e.target.value)} />
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
                  name="fecha"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={fecha || ""}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Suministro:
                </label>
                <select
                  id="suministro"
                  name="suministro"
                  value={suministro || ""}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setSuministro(e.target.value)}
                  required
                >
                  <option value="">Seleccione un suministro</option>
                  <option value="Normal">Normal</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proceso Clave (PC):
                </label>
                <select
                  id="pc"
                  name="pc"
                  value={pc || ""}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setPc(e.target.value)}
                  required
                >
                  <option value="">Seleccione el PC</option>
                  <option value="Educativo">PC Educativo</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proyecto:
                </label>
                <select
                  id="proyecto"
                  value={proyecto || ""}
                  name="Proyecto"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => {
                    {
                      setProyecto(e.target.value);
                      handleProyectoChange(e);
                    }
                    setFetchActivitiesFlag(true);
                  }}
                  required
                >
                  <option value="">Seleccione el Proyecto</option>
                  {ids.map((proyecto) => (
                    <option key={proyecto._id} value={proyecto._id}>
                      {proyecto.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <input type="hidden" id="myProyectoInput" name="myProyecto" value={myProyecto_ || ""} />
              <input type="hidden" id="myActividadInput" name="myActividad" value={myActividad_ || ""} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actividad:
                </label>
                <select
                  id="actividad"
                  name="actividad"
                  value={actividad || ""}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => {
                    {
                      setActividad(e.target.value);
                      handleChangeActividad(e);
                    }
                  }}
                  required
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
          <div className="border rounded-lg overflow-hidden">
            {items.map((item, index) => (
              <div key={index} className="division">
                <div className="labelsContainer flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad:
                  </label>
                  <input
                    type="number"
                    id="cantidad"
                    name={`items[${index}][cantidad]`}
                    placeholder="Ingrese una cantidad"
                    className="Inputs"
                    value={item.cantidad || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].cantidad = e.target.value;
                      setItems(newItems);
                    }}
                    required
                  />
                </div>
                <div className="labelsContainer flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad de medida:
                  </label>
                  <select
                    id="unidad"
                    name={`items[${index}][unidad]`}
                    className="Inputs2"
                    value={item.unidad || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].unidad = e.target.value;
                      setItems(newItems);
                    }}
                    required
                  >
                    <option value="">Selecciona una medida</option>
                    <option value="Paquete">Paquete</option>
                    <option value="Rollo">Rollo</option>
                    <option value="Caja">Caja</option>
                  </select>
                </div>
                <div className="labelsContainer flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del bien solicitado:
                  </label>
                  <textarea
                    id="descripcion"
                    name={`items[${index}][descripcion]`}
                    className="w-full max-w-5x1 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ingrese la descripción"
                    value={item.descripcion || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].descripcion = e.target.value;
                      setItems(newItems);
                    }} required
                  ></textarea>
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acción:
                  </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Justificación para la adquisición:
            </label>
            <textarea
              name="justificacion"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              id="justificacion"
              value={justificacion || ""}
              onChange={(e) => setJustificacion(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-black">
            <div
              className="tablafirmas"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >

              <div className="columna">
                <table className="mi-tabla">
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="inputSolicitud">Solicitud</label>
                      </td>
                    </tr>
                    <tr className="fila-grande">
                      <td>
                        <input
                          type="text"
                          className="Inputs"
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
                <table className="mi-tabla">
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
                          className="Inputs"
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
                <table className="mi-tabla">
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
                          className="Inputs"
                          id="Validacion"
                          name="Validacion"
                          value={Dirrecion || ""}
                          onChange={(e) => setDirrecion(e.target.value)}
                          required
                        />

                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="columna">
                <table className="mi-tabla">
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="inputAutorizo">Autorizó</label>
                      </td>
                    </tr>
                    <tr className="fila-grande">
                      <td>
                        <input
                          type="text"
                          className="Inputs"
                          id="Autorizo"
                          name="Autorizo"
                          value={Rectoría || ""}
                          onChange={(e) => setRectoría(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
              type="submit"
              onClick={editar ? actualizarDatos : guardarDatos}
            >
              {editar ? "Actualizar" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </form>
    </div>

  );
};