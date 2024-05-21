import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/solicitud.css";
import { generatePDF } from "../util/pdfUtils";
import { useSoli } from "../context/SolicitudContext";

export const RegisterTecnicoPage = () => {
  const formRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { createInfo } = useSoli();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = formRef.current;

    const formData = new FormData(form);
    const data = {
      folio: formData.get("Folio"),
      areaSolicitante: formData.get("AreaSolicitante"),
      solicita: formData.get("Solicita"),
      edificio: formData.get("Edificio"),
      tipoMantenimiento: formData.get("TipoMantenimiento"),
      tipoTrabajo: formData.get("TipoTrabajo"),
      tipoSolicitud: formData.get("TipoSolicitud"),
      suministro: formData.get("Suministro"),
      justificacion: formData.get("Justificacion"),
      fecha: selectedDate,
      proyecto: form.querySelector("#Proyecto option:checked").innerText,
      observaciones: formData.get("Observaciones"),
      cantidad: formData.get("Cantidad"),
      descripcion: formData.get("Descripcion"),
    };

    createInfo(data);
    console.log(data);
  };

  const handleGeneratePDF = (event) => {
    event.preventDefault();
    handleSubmit(event);

    const form = formRef.current;
    const formData = new FormData(form);
    const data = {
      folio: formData.get("Folio"),
      areaSolicitante: formData.get("AreaSolicitante"),
      solicita: formData.get("Solicita"),
      edificio: formData.get("Edificio"),
      tipoMantenimiento: formData.get("TipoMantenimiento"),
      tipoTrabajo: formData.get("TipoTrabajo"),
      tipoSolicitud: formData.get("TipoSolicitud"),
      suministro: formData.get("Suministro"),
      justificacion: formData.get("Justificacion"),
      fecha: selectedDate,
      actividad: form.querySelector("#Actividad option:checked").innerText,
      observaciones: formData.get("Observaciones"),
      insumosSolicitados: formData.get("InsumosSolicitados"),
      cantidad: formData.get("Cantidad"),
      descripcion: formData.get("Descripcion"),
    };
    
    generatePDF(data);
    console.log("Generate PDF with data:", data);
  };

  return (
    <div className="body2">
      <form className="formulariodatos" onSubmit={handleSubmit} ref={formRef}>
        <div className="division">
          <label htmlFor="Folio" className="labels">No. de folio:</label>
          <input type="number" id="Folio" name="Folio" className="Inputs2" required />
        </div>
        <div className="division">
          <label htmlFor="Fecha" className="labels">Selecciona la fecha:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            name="Fecha"
            required
            className="Inputs2"
          />
        </div>
        <div className="division">
          <label htmlFor="AreaSolicitante" className="labels">Área solicitante:</label>
          <input type="text" id="AreaSolicitante" name="AreaSolicitante" className="Inputs2" required />
        </div>
        <div className="division">
          <label htmlFor="Solicita" className="labels">Solicita:</label>
          <input type="text" id="Solicita" name="Solicita" className="Inputs2" required />
        </div>
        <div className="division">
          <label htmlFor="Edificio" className="labels">Edificio:</label>
          <input type="text" id="Edificio" name="Edificio" className="Inputs2" required />
        </div>
        <div className="division">
          <label htmlFor="TipoMantenimiento" className="labels">Tipo de Mantenimiento:</label>
          <select id="TipoMantenimiento" name="TipoMantenimiento" className="select" required>
            <option value="">Seleccione un tipo de mantenimiento</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>
        <div className="division">
          <label htmlFor="TipoTrabajo" className="labels">Tipo de Trabajo:</label>
          <select id="TipoTrabajo" name="TipoTrabajo" className="select" required>
            <option value="">Seleccione el tipo de trabajo</option>
            <option value="Educativo">PC Educativo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="division">
          <label htmlFor="TipoSolicitud" className="labels">Tipo de Solicitud:</label>
          <select id="TipoSolicitud" name="TipoSolicitud" className="select" required>
            <option value="">Seleccione el tipo de solicitud</option>
            <option value="Educativo">PC Educativo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="division">
          <label htmlFor="Justificacion" className="labels">Descripción (servicio requerido):</label>
          <textarea className="inputs3" id="Justificacion" name="Justificacion"></textarea>
        </div>
        <div className="division">
          <label htmlFor="Cantidad" className="labels">Cantidad:</label>
          <input type="number" id="Cantidad" name="Cantidad" className="Inputs2" placeholder="Cantidad" />
        </div>
        <div className="division">
          <label htmlFor="Descripcion" className="labels">Descripción:</label>
          <input type="text" id="Descripcion" name="Descripcion" className="Inputs2" placeholder="Descripción" />
        </div>
        <div className="division">
          <label htmlFor="Proyecto" className="labels">Proyecto:</label>
          <select id="Proyecto" name="Proyecto" className="select" required>
            <option value="">Seleccione el Proyecto</option>
            <option value="ProyectoA">Mantenimiento</option>
            <option value="ProyectoB">Mantenimiento 2</option>
          </select>
        </div>
        <div className="division">
          <label htmlFor="Observaciones" className="labels">Observaciones y/o diagnóstico técnico:</label>
          <textarea className="inputs3" id="Observaciones" name="Observaciones"></textarea>
        </div>
        <div className="botones">
          <button type="submit" className="btn-primary">Guardar cambios</button>
          <button type="button" className="btn-primary" onClick={handleGeneratePDF}>Generar PDF</button>
        </div>
      </form>
    </div>
  );
};
