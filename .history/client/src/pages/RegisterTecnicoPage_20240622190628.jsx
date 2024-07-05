import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import SubiendoImagenes from "../components/ui/SubiendoImagenes";
import { registerTecnicoSchema } from "../schemas/registerTenico.";

export const RegisterTecnicoPage = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(registerTecnicoSchema),
  });
  const formRef = useRef(null);
  const [fecha, setFecha] = useState(() => new Date().toISOString().split("T")[0]);
  const [fechaAtencion, setFechaAtencion] = useState(() => new Date().toISOString().split("T")[0]);
  const { user } = useAuth();
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState("");
  const [insumos, setInsumos] = useState([{ cantidad: "", descripcion: "" }]);
  const { createInfo, getIdsProyect, ids, getIdsProyectYAct } = useSoli();

  const imageUploadRef = useRef(null);  // Reference to the SubiendoImagenes component

  useEffect(() => {
    if (!projectsLoaded) {
      getIdsProyect()
        .then(() => setProjectsLoaded(true))
        .catch((error) => console.error("Error fetching projects:", error));
    }
  }, [projectsLoaded, getIdsProyect]);

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

  const onSubmit = async (data) => {
    data.user = user.id;
    console.log("Data to be submitted: ", data);

    try {
      // Upload images and get their URLs
      const imageURLs = await imageUploadRef.current.uploadImages();
      data.imageURLs = imageURLs;  // Add image URLs to the form data

      // Submit the form data
      await createInfo(data);
      const formData = new FormData(formRef.current);
      formData.append("imageURLs", JSON.stringify(imageURLs));  // Append image URLs to form data

      await fetch('http://localhost/Tutorial2_OpentbsWordPHP-master/ordenSoli.php', {
        method: 'POST',
        body: formData,
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
              {errors.fechaOrden && <p className="text-red-600">{errors.fechaOrden.message}</p>}
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
                required
              />
              {errors.areasoli && <p className="text-red-600">{errors.areasoli.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Atendio:</label>
              <input
                type="text"
                id="atendio"
                name="atendio"
                value={user.nombre}
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("atendio")}
                required
              />
              {errors.atendio && <p className="text-red-600">{errors.atendio.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6 text-black">
            <div>
              <label className="block text-sm font-medium mb-1">Proyecto:</label>
              <select
                name="proyecto"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("proyecto")}
                value={selectedProyecto}
                onChange={handleProyectoChange}
              >
                <option value="">Selecciona un proyecto</option>
                {ids.map((proyecto) => (
                  <option key={proyecto.id} value={proyecto.id}>{proyecto.id}-{proyecto.nombre_proyecto}</option>
                ))}
              </select>
              {errors.proyecto && <p className="text-red-600">{errors.proyecto.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 mb-6 text-black">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de atencion:</label>
              <input
                type="date"
                id="fecha_atencion"
                name="fecha_atencion"
                value={fechaAtencion || ""}
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setFechaAtencion(e.target.value)}
                {...register("fechaAtencion")}
              />
              {errors.fechaAtencion && <p className="text-red-600">{errors.fechaAtencion.message}</p>}
            </div>
          </div>
          <div className="text-black">
            <label className="block text-sm font-medium mb-1">Descripcion:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              {...register("descripcion")}
              required
            />
            {errors.descripcion && <p className="text-red-600">{errors.descripcion.message}</p>}
          </div>
          <h1>INSUMOS UTILIZADOS</h1>
          {insumos.map((insumo, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-6 text-black">
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad:</label>
                <input
                  type="text"
                  id={`insumos[${index}].cantidad`}
                  name={`insumos[${index}].cantidad`}
                  className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={insumo.cantidad}
                  onChange={(e) => handleInsumoChange(index, "cantidad", e.target.value)}
                  required
                />
                {errors.insumos?.[index]?.cantidad && <p className="text-red-600">{errors.insumos[index].cantidad.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripcion:</label>
                <input
                  type="text"
                  id={`insumos[${index}].descripcion`}
                  name={`insumos[${index}].descripcion`}
                  className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={insumo.descripcion}
                  onChange={(e) => handleInsumoChange(index, "descripcion", e.target.value)}
                  required
                />
                {errors.insumos?.[index]?.descripcion && <p className="text-red-600">{errors.insumos[index].descripcion.message}</p>}
              </div>
              <div className="flex items-center">
                <button onClick={(e) => eliminarItem(index, e)} className="mr-2">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                <button onClick={(e) => duplicarItem(index, e)}>
                  <FontAwesomeIcon icon={faClone} />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-center mb-6">
            <button onClick={agregarItem} className="btn btn-primary">Agregar Insumo</button>
          </div>
          <SubiendoImagenes ref={imageUploadRef} />
          <div className="flex justify-center">
            <button type="submit" className="btn btn-primary">Generar Documento</button>
          </div>
        </div>
      </form>
    </div>
  );
};
