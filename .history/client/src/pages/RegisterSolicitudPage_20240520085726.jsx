import React, { useRef, useState, useEffect } from "react";
import { generatePDF } from "../util/pdfUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { use } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import "../css/solicitud.css";
import "../css/tablas.css";

export const RegisterSolicitudPage = () => {
  
  const formRef = useRef(null);
  const [items, setItems] = useState([{ cantidad: "", unidad: "", descripcion: "" }]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProyecto, setSelectedProyecto] = useState("");
  
  const { crearmySoli, getIdsProyect, ids, getIdsProyectYAct, idsAct = [] } = useSoli();
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

  const handleProyectoChange = (event) => {
    event.preventDefault();
    setSelectedProyecto(event.target.value);
    getIdsProyectYAct(event.target.value)
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = formRef.current;
    

    const formData = new FormData(form);
    const data = {
      folio: formData.get("Folio"),
      suministro: formData.get("Suministro"),
      pc: formData.get("PC"),
      proyecto: form.querySelector("#Proyecto option:checked").innerText,
      actividad: form.querySelector("#Actividad option:checked").innerText,
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
    console.log(data)
    crearmySoli(data);
  };

  const handleGeneratePDF = () => {
    event.preventDefault();
    const form = formRef.current;
    const data = {
      folio: form.querySelector("#Folio").value,
      suministro: form.querySelector("#Suministro").value,
      pc: form.querySelector("#PC").value,
      proyecto: form.querySelector("#Proyecto option:checked").innerText,
      actividad: form.querySelector("#Actividad option:checked").innerText,
      justificacion: form.querySelector("#Justificacion").value,
      fecha: selectedDate,
      items,
    };
    handleSubmit(event)
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
          <input type="number" id="Folio" className="Inputs2" name="Folio" placeholder="folio"  required/>
          <label htmlFor="Fecha" className="labels">Fecha:</label>
          <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} name="Fecha" required className="Inputs2" />
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
          <select id="Proyecto" name="Proyecto" className="select"  value={selectedProyecto} onChange={handleProyectoChange} required>
            <option value="" disabled>Seleccione el Proyecto</option>
            {ids.map((proyecto) => (
              <option key={proyecto._id}   value={proyecto._id}>{proyecto.nombre}</option>
            ))}
          </select>
          <select id="Actividad" name="Actividad" className="select" required>
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
                  <input type="number" className="Inputs2" placeholder="Ingresa la cantidad" value={item.cantidad} onChange={(e) => handleItemChange(index, "cantidad", e.target.value)} name={`Cantidad_${index}`} required/>
                </td>
                <td>
                  <label className="labels">Unidad de medida:</label>
                  <select value={item.unidad} onChange={(e) => handleItemChange(index, "unidad", e.target.value)} className="select" name={`Unidad_${index}` } required>
                    <option value="">Seleccione la Unidad</option>
                    <option value="Paquete">Paquete</option>
                    <option value="Rollo">Rollo</option>
                    <option value="Caja">Caja</option>
                  </select>
                </td>
                <td>
                  <label className="labels">Descripcion del bien solicitado:</label>
                  <textarea className="inputs3" placeholder="Ingresa su descripción" value={item.descripcion} onChange={(e) => handleItemChange(index, "descripcion", e.target.value)} name={`Descripcion_${index}`} required ></textarea>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={addItem} className="btn-agregarfila btn-primary shadow-lg shadow-indigo-500/40">Agregar otra fila</button>
        <div className="division">
          <label className="labels">Justificacion para la adquisición:</label>
        </div>
        <textarea className="inputs4" id="Justificacion" name="Justificacion" placeholder="Ingrese la justificación de la solicitud" required></textarea>
        <div className="botones">
          <button type="submit" className="btn-primary">Guardar cambios</button>
          <button type="button" className="btn-primary" onClick={handleGeneratePDF}>Generar PDF</button>
        </div>
      </form>
    </div>
  );
};