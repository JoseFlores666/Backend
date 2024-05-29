import React, { useRef, useState } from "react";
import { generatePDF } from "../util/pdfUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { useParams } from "react-router-dom";
import "../css/solicitud.css";
import "../css/tablas.css";

export const RegisterSolicitudPage = () => {
  const { data: solicitudId } = useParams();
  const formRef = useRef(null);
  const [items, setItems] = useState([{ cantidad: "", unidad: "", descripcion: "" }]);
  const { getunSolitud, updateSoli, crearmySoli, ids, idsAct } = useSoli();
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = formRef.current;
    const formData = new FormData(form);
    const data = {
      folio: formData.get("Folio"),
      suministro: formData.get("Suministro"),
      pc: formData.get("PC"),
      proyecto: formData.get("Proyecto"),
      actividad: formData.get("Actividad"),
      justificacion: formData.get("Justificacion"),
      fecha: formData.get("Fecha"),
      items,
      firmas: {
        solicitud: formData.get("Solicitud"),
        revision: formData.get("Revision"),
        validacion: formData.get("Validacion"),
        autorizacion: formData.get("Autorizacion"),
      },
      user: user.id,
      estado: "Pendiente",
    };

    try {
      if (solicitudId) {
        await updateSoli(solicitudId, data);
        console.log("Solicitud actualizada", data);
      } else {
        await crearmySoli(data);
        console.log("Solicitud creada", data);
      }
      generatePDF(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addItem = () => {
    setItems([...items, { cantidad: "", unidad: "", descripcion: "" }]);
  };

  return (
    <div className="body2">
      <h2 className="labels">{solicitudId ? "Actualizar Solicitud" : "Registrar Solicitud"}</h2>
      <form className="formulariodatos" onSubmit={handleSubmit} ref={formRef}>
        {/* Campos de formulario */}
        <div className="division">
          <label htmlFor="Folio" className="labels">Folio:</label>
          <input type="number" id="Folio" className="Inputs2" name="Folio" placeholder="folio" required />
          <label htmlFor="Fecha" className="labels">Fecha:</label>
          <DatePicker
            id="Fecha"
            name="Fecha"
            selected={new Date()}
            className="Inputs2"
          />
        </div>
        <div className="division">
          <label className="labels">Tipo de Suministro:</label>
          <label className="labels">Proceso Clave (PC):</label>
        </div>
        <div className="division">
          <select id="Suministro" name="Suministro" className="select" required>
            <option value="">Seleccione un suministro</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
          <select id="PC" name="PC" className="select" required>
            <option value="">Seleccione el PC</option>
            <option value="Educativo">PC Educativo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="division">
          <label className="labels">Proyecto:</label>
          <label className="labels">Actividad:</label>
        </div>
        <div className="division">
          <select
            id="Proyecto"
            name="Proyecto"
            className="select"
            required
          >
            <option value="" disabled>Seleccione el Proyecto</option>
            {ids.map((proyecto) => (
              <option key={proyecto._id} value={proyecto._id}>{proyecto.nombre}</option>
            ))}
          </select>
          <select
            id="Actividad"
            name="Actividad"
            className="select"
            required
          >
            <option value="" disabled>Seleccione la Actividad</option>
            {Array.isArray(idsAct) ? (
              idsAct.map((actividad) => (
                <option key={actividad._id} value={actividad._id}>{actividad.nombre}</option>
              ))
            ) : (
              <option value="" disabled>No hay actividades disponibles</option>
            )}
          </select>
        </div>
        {/* Fin de los campos de formulario */}
        <button type="submit" className="btn-primary">
          {solicitudId ? "Guardar cambios" : "Registrar"}
        </button>
        <button type="button" onClick={addItem} className="btn-primary">
          Agregar otra fila
        </button>
        <button type="button" onClick={generatePDF} className="btn-primary">
          Generar PDF
        </button>
      </form>
    </div>
  );
};
