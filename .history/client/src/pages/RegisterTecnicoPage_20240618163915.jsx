import React, { useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/solicitud.css";
import { useForm } from "react-hook-form";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { Button, Input, Label } from "../components/ui";

export const RegisterTecnicoPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const formRef = useRef(null);

  const [selectedOrderDate, setSelectedOrderDate] = useState(new Date());
  const [selectedAttentionDate, setSelectedAttentionDate] = useState(new Date());
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState("");

  const { createInfo, getIdsProyect, ids, getIdsProyectYAct } = useSoli();
  const { user } = useAuth();

  useEffect(() => {
    if (!projectsLoaded) {
      getIdsProyect()
        .then(() => {
          setProjectsLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
        });
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

  //selecionar fecha de orden
  const handleOrderDateChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setValue("fechaOrden", formattedDate);
    setSelectedOrderDate(date);
    console.log(user.)
  };

  //selecionar fecha de atencion
  const handleAttentionDateChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setValue("fechaAtencion", formattedDate);
    setSelectedAttentionDate(date);
  };

  const onSubmit = async (data) => {
    
    console.log("Data to be submitted: ", data);

    createInfo(data)
    try {
      const response = await fetch('http://localhost/Tutorial2_OpentbsWordPHP-master/ordenSoli.php', {
        method: 'POST',
        body: new FormData(formRef.current),
      });


    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  return (
    <div className="formulariodatos">
      <form ref={formRef} method="post" target="_blank" onSubmit={handleSubmit(onSubmit)}>
        <br />

        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
          <h1 className="titulo border border-black">Orden de trabajo de mantenimiento a mobiliario e instalaciones</h1>
          <div className="division">
            <Label htmlFor="folio" className="labels">
              No. de folio:
            </Label>
            <Input
              type="number"
              id="folio"
              name="folio"
              className="Inputs2"
              {...register("folio")}
              required
            />
            <Label htmlFor="fechaOrden" className="labels">
              Selecciona la fecha de orden:
            </Label>
            <DatePicker
              selected={selectedOrderDate}
              onChange={handleOrderDateChange}
              name="fechaOrden"
              className="Inputs2"
              required
            />
          </div>
        </div>
        <br />

        <div className="bg-white p-6 rounded-lg shadow-md text-black border border-black">
          <div className="division">
            <Label htmlFor="areasoli" className="labels">
              Area solicitante:
            </Label>
            <Input
              type="text"
              id="areasoli"
              name="areasoli"
              {...register("areasoli")}
              className="Inputs2"
              required
            />
            <Label htmlFor="solicita" className="labels">
              Solicita:
            </Label>
            <Input
              type="text"
              id="solicita"
              name="solicita"
              className="Inputs2"
              {...register("solicita")}
              required
            />
            <Label htmlFor="edificio" className="labels">
              Edificio:
            </Label>
            <Input
              type="text"
              id="edificio"
              name="edificio"
              className="Inputs2"
              {...register("edificio")}
              required
            />
          </div>
          <div className="division">
            <Label className="labels">Tipo de Mantenimiento:</Label>
            <Label className="labels">Tipo de Trabajo:</Label>
            <Label className="labels">Tipo de Solicitud:</Label>
          </div>
          <div className="division">
            <select
              id="tipoMantenimiento"
              {...register("tipoMantenimiento")}
              name="tipoMantenimiento"
              className="select"
              required
            >
              <option value="">Seleccione un tipo de mantenimiento</option>
              <option value="Normal">Normal</option>
              <option value="Urgente">Urgente</option>
            </select>
            <select
              id="tipoTrabajo"
              {...register("tipoTrabajo")}
              name="tipoTrabajo"
              className="select"
              required
            >
              <option value="">Seleccione el tipo de trabajo</option>
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
            </select>
            <select
              id="tipoSolicitud"
              {...register("tipoSolicitud")}
              name="tipoSolicitud"
              className="select"
              required
            >
              <option value="">Seleccione el tipo de solicitud</option>
              <option value="Educativo">PC Educativo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="division">
            <Label className="labels">Descripción (servicio requerido):</Label>
          </div>
          <textarea
            className="inputs3"
            id="desc"
            name="desc"
            {...register("desc")}
          ></textarea>
        </div>
        <div className="division" style={{ backgroundColor: "green" }}>
          <Label className="labels">Llenado Exclusivo para el DEP MSG:</Label>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-black border border-black">
          <div>
            <Label className="labels">Seleccione la fecha de atención:</Label>
          </div>
          <DatePicker
            selected={selectedAttentionDate}
            onChange={handleAttentionDateChange}
            className="Inputs2"
            name="fechaAtencion"
            required
          />
          <div className="division">
            <Label className="labels">Insumos Solicitados:</Label>
          </div>
          <div className="division">
            <Label className="labels">Cantidad:</Label>
            <Label className="labels">Descripción:</Label>
          </div>
          <div className="division">
            <Input
              type="number"
              id="cantidad"
              name="cantidad"
              className="Inputs2"
              placeholder="Ingresa la cantidad"
              {...register("cantidad")}
            />
            <Input
              type="text"
              className="Inputs2"
              id="descripcion"
              name="descripcion"
              {...register("descripcion")}
            />
          </div>
          <div className="division">
            <select
              id="proyecto"
              name="proyecto"
              className="select"
              value={selectedProyecto}
              onChange={handleProyectoChange}
              required
            >
              <option value="" disabled>
                Seleccione el Proyecto
              </option>
              {ids.map((proyecto) => (
                <option key={proyecto._id} value={proyecto._id}>
                  {proyecto.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="division">
            <Label className="labels">Observaciones y/o diagnóstico técnico:</Label>
          </div>
          <textarea
            className="inputs3"
            id="obs"
            name="obs"
            {...register("obs")}
          ></textarea>
        </div>
        <div className="botones">
          <Button type="submit" className="btn-primary">
            Guardar cambios
          </Button>
          <Button type="button" className="btn-primary">
            Generar PDF
          </Button>
        </div>
      </form>
    </div>
  );
};
