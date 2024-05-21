import React, { useRef, useState, useEffect } from "react";
import { generatePDF } from "../util/pdfUtils";
import "../css/solicitud.css";
import "../css/tablas.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";

export const RegisterSolicitudPage = () => {
  const formRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState([{ cantidad: "", unidad: "", descripcion: "" }]);
  const { crearmySoli, getIdsProyect, ids, getIdsProyectYAct, idsAct } = useSoli(); // Asegúrate de usar idsAct
  const [selectedProyecto, setSelectedProyecto] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    getIdsProyect();
  }, [getIdsProyect]);

  useEffect(() => {
    if (selectedProyecto) {
      getIdsProyectYAct(selectedProyecto);
    }
  }, [selectedProyecto, getIdsProyectYAct]);

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
          <label htmlFor="Folio" className="labels">
            Folio:
          </label>
          <input
            type="number"
            id="Folio"
            className="Inputs2"
            name="Folio"
            placeholder="folio"
          />
          <label htmlFor="" className="labels">
            Fecha:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            name="Fecha"
            className="Inputs2"
          />
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
          <select
            id="Proyecto"
            name="Proyecto"
            className="select"
            value={selectedProyecto}
            onChange={handleProyectoChange}
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
          <select id="Actividad" name="Actividad" className="select">
            <option value="" disabled>
              Seleccione la Actividad
            </option>
            {idsAct.map((actividad) => (
              <option key={actividad._id} value={actividad._id}>
                {actividad.nombre}
              </option>
            ))}
          </select>
        </div>
        <table>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <label className="labels">Cantidad:</label>
                  <input
                    type="number"
                    className="Inputs2"
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(index, "cantidad", e.target.value)}
                  />
                </td>
                <td>
                  <label className="labels">Unidad:</label>
                  <input
                    type="text"
                    className="Inputs2"
                    value={item.unidad}
                    onChange={(e) => handleItemChange(index, "unidad", e.target.value)}
                  />
                </td>
                <td>
                  <label className="labels">Descripción:</label>
                  <input
                    type="text"
                    className="Inputs2"
                    value={item.descripcion}
                    onChange={(e) => handleItemChange(index, "descripcion", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={addItem}>
          Añadir Ítem
        </button>
        <div className="division">
          <button type="submit">Guardar</button>
          <button type="button" onClick={handleGeneratePDF}>
            Generar PDF
          </button>
        </div>
      </form>
    </div>
  );
};
