import React, { useRef, useState, useEffect } from "react";
import { generatePDF } from "../util/pdfUtils";
import "../css/solicitud.css";
import "../css/tablas.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";

export const RegisterSolicitudPage = () => {
  // Referencia al formulario
  const formRef = useRef(null);
  
  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Estado para los ítems del formulario
  const [items, setItems] = useState([{ cantidad: "", unidad: "", descripcion: "" }]);
  
  // Estado para los proyectos y actividades
  const { crearmySoli, getIdsProyect, ids, getIdsProyectYAct, idsAct = [] } = useSoli();
  const [selectedProyecto, setSelectedProyecto] = useState("");
  const { user } = useAuth();
  
  // Estado para las banderas de carga de proyectos y actividades
  const [projectsFetched, setProjectsFetched] = useState(false);
  const [activitiesFetched, setActivitiesFetched] = useState(false);


 useEffect(() => {
  if (!projectsFetched) {
    getIdsProyect();
    setProjectsFetched(true);
  }
}, [projectsFetched, getIdsProyect]);

useEffect(() => {
  if (selectedProyecto && !activitiesFetched) {
    getIdsProyectYAct(selectedProyecto);
    setActivitiesFetched(true);
  }
}, [selectedProyecto, getIdsProyectYAct, activitiesFetched]);


  const handleProyectoChange = (event) => {
    setSelectedProyecto(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const data = {
      folio: formData.get("Folio"),
      suministro: formData.get("Suministro"),
      pc: formData.get("PC"),
      proyecto: formData.get("Proyecto"),
      actividad: formData.get("Actividad"),
      justificacion: formData.get("Justificacion"),
      fecha: selectedDate,
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
    crearmySoli(data);
  };

  const handleGeneratePDF = () => {
    const form = formRef.current;
    const data = {
      folio: form.querySelector("#Folio").value,
      suministro: form.querySelector("#Suministro").value,
      pc: form.querySelector("#PC").value,
      proyecto: form.querySelector("#Proyecto").value,
      actividad: form.querySelector("#Actividad").value,
      justificacion: form.querySelector("#Justificacion").value,
      fecha: selectedDate,
      items,
    };
    generatePDF(data);
  };

  const addItem = () => {
    setItems([...items, { cantidad: "", unidad: "", descripcion: "" }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className="body2">
      <form className="formulariodatos" onSubmit={handleSubmit} ref={formRef}>
        <div className="division">
          <label htmlFor="Folio" className="labels">Folio:</label>
          <input type="number" id="Folio" className="Inputs2" name="Folio" placeholder="folio" />
          <label htmlFor="Fecha" className="labels">Fecha:</label>
          <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} name="Fecha" className="Inputs2" />
        </div>
        <div className="division">
          <label className="labels">Tipo de Suministro:</label>
          <label className="labels">Proceso Clave (PC):</label>
        </div>
        <div className="division">
          <select id="Suministro" name="Suministro" className="select">
            <option value="">Seleccione un suministro</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
          <select id="PC" name="PC" className="select">
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
          <select id="Proyecto" name="Proyecto" className="select" value={selectedProyecto} onChange={handleProyectoChange}>
            <option value="" disabled>Seleccione el Proyecto</option>
            {ids.map((proyecto) => (
              <option key={proyecto._id}   value={proyecto._id}>{proyecto.nombre}</option>
              
            ))}
            
          </select>
          <select id="Actividad" name="Actividad" className="select">
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
        <table>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <label className="labels">Cantidad:</label>
                  <input type="number" className="Inputs2" placeholder="Ingresa la cantidad" value={item.cantidad} onChange={(e) => handleItemChange(index, "cantidad", e.target.value)} name={`Cantidad_${index}`} />
                </td>
                <td>
                  <label className="labels">Unidad de medida:</label>
                  <select value={item.unidad} onChange={(e) => handleItemChange(index, "unidad", e.target.value)} className="select" name={`Unidad_${index}`}>
                    <option value="">Seleccione la Unidad</option>
                    <option value="Paquete">Paquete</option>
                    <option value="Rollo">Rollo</option>
                    <option value="Caja">Caja</option>
                  </select>
                </td>
                <td>
                  <label className="labels">Descripcion del bien solicitado:</label>
                  <textarea className="inputs3" placeholder="Ingresa su descripción" value={item.descripcion} onChange={(e) => handleItemChange(index, "descripcion", e.target.value)} name={`Descripcion_${index}`}></textarea>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={addItem} className="btn-agregarfila btn-primary">Agregar otra fila</button>
        <div className="division">
          <label className="labels">Justificacion para la adquisición:</label>
        </div>
        <textarea className="inputs4" id="Justificacion" name="Justificacion" placeholder="Ingrese la justificación de la solicitud"></textarea>
        <div className="botones">
          <button type="submit" className="btn-primary">Guardar cambios</button>
          <button type="button" className="btn-primary" onClick={handleGeneratePDF}>Generar PDF</button>
        </div>
      </form>
    </div>
  );
};
