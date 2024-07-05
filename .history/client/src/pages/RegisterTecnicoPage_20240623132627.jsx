import React, { useRef, useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import SubiendoImagenes from "../components/ui/SubiendoImagenes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerTecnicoSchema } from "../schemas/RegisterTenico";
import Swal from "sweetalert2";

export const RegisterTecnicoPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerTecnicoSchema), });

  const formRef = useRef(null);

  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [fechaAtencion, setFechaAtencion] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });


  const { user } = useAuth();
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState("");
  // const [folioLoaded, setFolioLoaded] = useState(false);

  const [insumos, setInsumos] = useState([{ cantidad: "", descripcion: "" }]);
  const { createInfo, getIdsProyect, ids, getIdsProyectYAct, traeFolioInternoInforme, myFolioInternoInfo } = useSoli();

  const imageUploadRef = useRef(null);

  useEffect(() => {
    if (!projectsLoaded) {
      fetchFolio()
      getIdsProyect()
        .then(() => {
          setProjectsLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
        });
    }
  }, [projectsLoaded, getIdsProyect]);

  const fetchFolio = async () => {
    try {
      await traeFolioInternoInforme();
    } catch (error) {
      console.error("Error al obtener la el folio:", error);
    }
  };
  useEffect(() => {
    if (myFolioInternoInfo) {
      setValue("folio", myFolioInternoInfo);
    }
  }, [myFolioInternoInfo, setValue]);

  const handleProyectoChange = async (event) => {
    const projectId = event.target.value;
    setSelectedProyecto(projectId);
    setValue("proyecto", projectId);

    try {
      await getIdsProyectYAct(projectId);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const agregarItem = (e) => {
    e.preventDefault();
    if (insumos.length < 4) {
      setInsumos([...insumos, { cantidad: "", descripcion: "" }]);
    } else {
      alert("No se pueden agregar más de 4 insumos.");
    }
  };

  const eliminarItem = (index, e) => {
    e.preventDefault();
    setInsumos(insumos.filter((_, i) => i !== index));
  };

  const duplicarItem = (index, e) => {
    e.preventDefault();
    if (insumos.length < 4) {
      const insumoToDuplicate = insumos[index];
      setInsumos([...insumos, { ...insumoToDuplicate }]);
    } else {
      alert("No se pueden agregar más de 4 insumos.");
    }
  };

  const handleInsumoChange = (index, field, value) => {
    const newInsumos = [...insumos];
    newInsumos[index][field] = value;
    setInsumos(newInsumos);
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    data.user = user.id;


    try {
      // Upload images and get their URLs
      const imageURLs = await imageUploadRef.current.uploadImages();
      data.imagen = imageURLs;  // Add image URLs to the form data
      console.log("Data to be submitted: ", data);
      await createInfo(data);
      Swal.fire({
        title: "Completado!",
        text: "Actualización Exitosa",
        icon: "success",
        confirmButtonText: "Cool",
      });
      const formData = new FormData(e.target);

      await fetch('http://localhost/Tutorial2_OpentbsWordPHP-master/ordenSoli.php', {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };
  return (
    <div className="mx-auto max-w-5xl p-4">
      <form ref={formRef} method="post" target="_blank" onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white p-6 rounded-md shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black">Orden de trabajo de mantenimiento a mobiliario e instalaciones</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6 text-black">
            <div>
              <label className="block text-sm font-medium mb-1">Folio Interno:</label>
              <input
                type="number"
                id="folio"
                name="folio"
                disabled
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("folio")}
              />

            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Selecciona la fecha:</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={fecha || ""}
                onChange={(e) => setFecha(e.target.value)}
                {...register("fechaOrden")}
              />
              {errors.fechaOrden && (
                <p className="text-red-500 mt-0.5">{errors.fechaOrden.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6 text-black">
            <div>
              <label className="block text-sm font-medium mb-1">Area solicitante:</label>
              <input
                type="text"
                id="areasoli"
                name="areasoli"
                {...register("areasoli")}
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              // required
              />
              {errors.areasoli && (
                <p className="text-red-500 mt-0.5">{errors.areasoli.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Solicita:</label>
              <input
                type="text"
                id="solicita"
                name="solicita"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("solicita")}
              // required
              />
              {errors.solicita && (
                <p className="text-red-500 mt-0.5">{errors.solicita.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Edificio:</label>
              <input
                type="text"
                id="edificio"
                name="edificio"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("edificio")}
              // required
              />
              {errors.edificio && (
                <p className="text-red-500 mt-0.5">{errors.edificio.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6 text-black">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Mantenimiento:</label>
              <select
                id="tipoMantenimiento"
                {...register("tipoMantenimiento")}
                name="tipoMantenimiento"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              // required
              >
                <option value="">Seleccione un tipo de mantenimiento</option>
                <option value="mobilario">Mobilario</option>
                <option value="instalaciones">Instalaciones</option>
              </select>
              {errors.tipoMantenimiento && (
                <p className="text-red-500 mt-0.5">{errors.tipoMantenimiento.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Trabajo:</label>
              <select
                id="tipoTrabajo"
                {...register("tipoTrabajo")}
                name="tipoTrabajo"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              // required
              >
                <option value="">Seleccione el tipo de trabajo</option>
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
              </select>
              {errors.tipoTrabajo && (
                <p className="text-red-500 mt-0.5">{errors.tipoTrabajo.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Solicitud:</label>
              <select
                id="tipoSolicitud"
                {...register("tipoSolicitud")}
                name="tipoSolicitud"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              // required
              >
                <option value="">Seleccione el tipo de solicitud</option>
                <option value="normal">Normal</option>
                <option value="urgente">Urgente</option>
              </select>
              {errors.tipoSolicitud && (
                <p className="text-red-500 mt-0.5">{errors.tipoSolicitud.message}</p>
              )}
            </div>
          </div>
          <div className="mb-6 text-black">
            <label className="block text-sm font-medium mb-1">Descripción (servicio requerido):</label>
            <textarea
              className="w-full resize-none p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              id="desc"
              name="desc"
              {...register("desc")}
            ></textarea>
            {errors.desc && (
              <p className="text-red-500 mt-0.5">{errors.desc.message}</p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
            <SubiendoImagenes ref={imageUploadRef} />
          </div>
          <div className="mb-6 bg-green-500 p-3 rounded-md text-white">
            <label className="block text-center text-sm font-bold mb-1">Llenado Exclusivo para el DEP MSG:</label>
          </div>
          <div className="text-black flex flex-col items-center">
            <label className="block text-sm font-medium mb-1">Seleccione la fecha de atención:</label>
            <input
              type="date"
              id="fechaAtencion"
              name="fechaAtencion"
              className="w-96 p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={fechaAtencion || ""}
              onChange={(e) => setFechaAtencion(e.target.value)}
              {...register("fechaAtencion")}
            />
            {errors.fechaAtencion && (
              <p className="text-red-500 mt-0.5">{errors.fechaAtencion.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Insumos Solicitados:</label>
            <div className="flex justify-center items-center">
              <table className="min-w-full divide-y divide-black text-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-center text-xs font-medium text-black uppercase tracking-wider p-2 border">Cantidad</th>
                    <th className="text-center text-xs font-medium text-black uppercase tracking-wider p-2 border">Descripción del insumo</th>
                    <th className="text-center text-xs font-medium text-black uppercase tracking-wider p-2 border">Acción</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-400">
                  {insumos.map((insumo, index) => (
                    <tr key={index}>
                      <td className="w-1/6 p-2 align-middle">
                        <input
                          type="number"
                          id={`cantidad-${index}`}
                          name={`insumos[${index}].cantidad`} // Ensure proper name format
                          placeholder="Ingresa la cantidad"
                          className="text-center w-full p-2 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          value={insumo.cantidad}
                          onChange={(e) => handleInsumoChange(index, "cantidad", e.target.value)}
                        />
                      </td>
                      <td className="w-1/3 p-2 align-middle">
                        <textarea
                          type="text"
                          className="w-full resize-none p-1 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          id={`descripcion-${index}`}
                          name={`insumos[${index}].descripcion`} // Ensure proper name format
                          placeholder="Descripción"
                          value={insumo.descripcion}
                          onChange={(e) => handleInsumoChange(index, "descripcion", e.target.value)}
                        />
                      </td>
                      <td className="w-1/6 p-2 align-middle">
                        <div className="flex space-x-4 justify-center">
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={(e) => eliminarItem(index, e)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={(e) => duplicarItem(index, e)}
                          >
                            <FontAwesomeIcon icon={faClone} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-md border border-black"
                onClick={agregarItem}
              >
                Añadir Insumo
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6 text-black">
            <div>
              <label className="block text-sm font-medium mb-1">Proyecto:</label>
              <select
                id="proyecto"
                name="proyecto"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedProyecto}
                onChange={handleProyectoChange}
              // required
              >
                <option value="" disabled>Seleccione el Proyecto</option>
                {ids.map((proyecto) => (
                  <option key={proyecto._id} value={proyecto._id}>
                    {proyecto.nombre}
                  </option>
                ))}
              </select>
              {errors.proyecto && (
                <p className="text-red-500 mt-0.5">{errors.proyecto.message}</p>
              )}
            </div>
            <div className="">
              <div>
                <label className="block text-sm font-medium mb-1">Observaciones y/o diagnóstico técnico:</label>
                <textarea
                  className="w-full resize-none p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  id="obs"
                  name="obs"
                  {...register("obs")}
                ></textarea>
                {errors.obs && (
                  <p className="text-red-500 mt-0.5">{errors.obs.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-black" style={{ display: 'none' }}>
            <div className="flex justify-between mt-4">
              {['Solicitud', 'Revisión', 'Validación', 'Autorizó'].map((label, idx) => (
                <div key={idx} className="w-1/4">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td><label htmlFor={label.toLowerCase()}>{label}</label></td>
                      </tr>
                      <tr className="h-16">
                        <td>
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            id={label.toLowerCase()}
                            name={label.toLowerCase()}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
          <div className="flex space-x-4 mt-6 justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md border border-black">
              Guardar cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
