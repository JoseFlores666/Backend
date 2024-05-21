import React, { useRef, useState } from "react";
import { generatePDF } from "../util/pdfUtils";
import "../css/solicitud.css";
import "..//css/tablas.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";

export const RegisterSolicitudPage = () => {
  const formRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState([
    { cantidad: "", unidad: "", descripcion: "" },
  ]);
  const { crearmySoli } = useSoli();
  const { user } = useAuth();

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
          <input type="number" id="Folio" className="Inputs2" name="Folio"  placeholder="folio" />
          <label htmlFor="" className="labels">Fecha:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            name="Fecha" className="Inputs2"
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
          <select id="Proyecto" name="Proyecto" className="select">
            <option value="">Seleccione el Proyecto</option>
            <option value="ProyectoA">Mantenimiento</option>
            <option value="ProyectoB">Mantenimiento 2</option>
          </select>
          <select id="Actividad" name="Actividad" className="select">
            <option value="">Seleccione la Actividad</option>
            <option value="Actividad A">
              Verificación de la verificación del programa anual de
              mantenimiento
            </option>
            <option value="Actividad B">Actividad B</option>
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
            className="Inputs2" placeholder="Ingresa la cantidad"
            value={item.cantidad}
            onChange={(e) =>
              handleItemChange(index, "cantidad", e.target.value)
            }
            name={`Cantidad_${index}`}
          />
        </td>
        <td>
          <label className="labels">Unidad de medida:</label>
          <select
            value={item.unidad}
            onChange={(e) =>
              handleItemChange(index, "unidad", e.target.value)
            }
            className="select"
            name={`Unidad_${index}`}
          >
            <option value="">Seleccione la Unidad</option>
            <option value="Paquete">Paquete</option>
            <option value="Rollo">Rollo</option>
            <option value="Caja">Caja</option>
          </select>
        </td>
        <td>
          <label className="labels">Descripcion del bien solicitado:</label>
          <textarea
            className="inputs3" placeholder="Ingresa su descripción"
            value={item.descripcion}
            onChange={(e) =>
              handleItemChange(index, "descripcion", e.target.value)
            }
            name={`Descripcion_${index}`}
          ></textarea>
        </td>
      </tr>
    ))}
  </tbody>
</table>
<button type="button" onClick={addItem} className="btn-agregarfila btn-primary">
  Agregar otra fila
</button>

        <div className="division">
          <label className="labels">Justificacion para la adquisición:</label>
        </div>
        <textarea
          className="inputs4"
          id="Justificacion"
          name="Justificacion"
        ></textarea>
        <div className="botones">
          <button type="submit" className="btn-primary">
            Guardar cambios
          </button>
          <button className="btn-primary" onClick={handleGeneratePDF}>
            Generar PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterSolicitudPage;
