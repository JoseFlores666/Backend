import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/solicitud.css";

export const RegisterTecnicoPage = () => {
  const formRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = (event) => {
    event.preventDefault();
    // const form = formRef.current;

    // const formData = new FormData(form);
    // const data = {
    //   folio: formData.get("Folio"),
    //   suministro: formData.get("Suministro"),
    //   pc: formData.get("PC"),
    //   proyecto: form.querySelector("#Proyecto option:checked").innerText,
    //   actividad: form.querySelector("#Actividad option:checked").innerText,
    //   justificacion: formData.get("Justificacion"),
    //   fecha: selectedDate,
    //   items,
    //   firmas: {
    //     solicitud: formData.get("Solicitud"),
    //     revision: formData.get("Revision"),
    //     validacion: formData.get("Validacion"),
    //     autorizacion: formData.get("Autorizacion"),
    //   },
    //   user: user.id,
    //   estado: "Pendiente",
    // };
    // crearmySoli(data);
  };

  const handleGeneratePDF = () => {
    event.preventDefault();
    // const form = formRef.current;
    // const data = {
    //   folio: form.querySelector("#Folio").value,
    //   suministro: form.querySelector("#Suministro").value,
    //   pc: form.querySelector("#PC").value,
    //   proyecto: form.querySelector("#Proyecto option:checked").innerText,
    //   actividad: form.querySelector("#Actividad option:checked").innerText,
    //   justificacion: form.querySelector("#Justificacion").value,
    //   fecha: selectedDate,
    //   items,
    // };
    handleSubmit(event)
    generatePDF(data);
  };

  return (
    <div className="body2">
      <form className="formulariodatos" onSubmit={handleSubmit} ref={formRef}>
        <div className="division">
          <label htmlFor="Folio" className="labels">
            No. de folio:
          </label>
          <input type="number" id="Folio" className="Inputfolio" />
          <label htmlFor="">Selecciona la fecha:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
        </div>
        <div className="division">
          <label htmlFor="Folio" className="labels">
            Area solicitante:
          </label>
          <input type="text" id="Folio" className="Inputfolio" />
          <label htmlFor="">Solicita:</label>
          <input type="text" />
          <label htmlFor="">Edificio:</label>
          <input type="text" />
        </div>
        <div className="division">
          <label className="labels">Tipo de Mantenimiento:</label>
          <label className="labels">Tipo de Trabajo:</label>
          <label className="labels">Tipo de Solicitud:</label>
        </div>

        <div className="division">
          <select id="Suministro">
            <option value="">Seleccione un suministro</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
          <select id="PC">
            <option value="">Seleccione el PC</option>
            <option value="Educativo">PC Educativo</option>
            <option value="Otro">Otro</option>
          </select>
          <select id="PC">
            <option value="">Seleccione el PC</option>
            <option value="Educativo">PC Educativo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="division">
          <label className="labels">Descripción (servicio requerido):</label>
        </div>
        <textarea className="inputs3" id="Justificacion"></textarea>
        <div className="division" style={{ backgroundColor: "green" }}>
          <label className="labels">Llenado Exclusivo para el DEP MSG:</label>
        </div>
        <div>
          <label className="labels">Seleccione la fecha de atencion:</label>
        </div>

        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />

        <div className="division">
          <label className="labels">Insumos Solicitados:</label>
        </div>

        <div className="division">
          <label className="labels">Cantidad:</label>
          <label className="labels">Descripcion:</label>
        </div>

        <div className="division">
          <select id="Proyecto">
            <option value="">Seleccione el Proyecto</option>
            <option value="ProyectoA">Mantenimiento</option>
            <option value="ProyectoB">Mantenimiento 2</option>
          </select>

          <textarea className="inputs3" id="Justificacion"></textarea>
        </div>

        <div className="division">
          <label className="labels">
            Observaciones y/o diagnóstico técnico:
          </label>
        </div>
        <textarea className="inputs3" id="Justificacion"></textarea>
        <div className="botones">
        <button type="submit" className="btn-primary">Guardar cambios</button>
          <button type="button" className="btn-primary" onClick={handleGeneratePDF}>Generar PDF</button>
        </div>
      </form>
    </div>
  );
};
