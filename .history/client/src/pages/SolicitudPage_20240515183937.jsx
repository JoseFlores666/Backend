import React, { useRef } from "react";
import { Button, Input, Label } from "../components/ui";
import { generatePDF } from "../util/pdfUtils.js";
import "../../css/solicitud.css";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";

const SolicitudPage = () => {
  const formRef = useRef(null);
  const { user } = useAuth();
  const { crearmySoli } = useSoli();

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = formRef.current;
    const data = {
      folio: form.querySelector("#Folio").value,
      tipoSuministro: form.querySelector("#Suministro").value,
      procesoClave: form.querySelector("#PC").value,
      proyecto: form.querySelector("#Proyecto").value,
      actividad: form.querySelector("#Actividad").value,
      cantidad: parseInt(form.querySelector("#Cantidad").value),
      unidad: form.querySelector("#Unidad").value,
      descripcion: form.querySelector("#Descripcion").value,
      justificacion: form.querySelector("#Justificacion").value,
      firmas: {
        solicitud: form.querySelector("#Solicitud").value,
        revision: form.querySelector("#Revision").value,
        validacion: form.querySelector("#Validacion").value,
        autorizacion: form.querySelector("#Autorizacion").value,
      },
      user: user.id,
      estado: "Pendiente",
    };

    console.log(data);
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
      cantidad: form.querySelector("#Cantidad").value,
      unidad: form.querySelector("#Unidad").value,
      descripcion: form.querySelector("#Descripcion").value,
      justificacion: form.querySelector("#Justificacion").value,
    };

    generatePDF(data);
  };

  return (
    <div className="body2">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="formulariodatos">
          <div className="division">
            <Label htmlFor="Folio" className="labels">
              No. de folio:
            </Label>
            <Input type="number" id="Folio" className="Inputfolio" />
            <div className="fecha">
              <Label htmlFor="Dia" className="fecha-label">
                Fecha
              </Label>
              <div className="fecha-inputs">
                <Input type="number" id="Dia" placeholder="Día" />
                <Input type="number" id="Mes" placeholder="Mes" />
                <Input type="number" id="Año" placeholder="Año" />
              </div>
            </div>
          </div>
          <div className="division">
            <Label className="labels">Tipo de Suministro:</Label>
            <select id="Suministro" className="select">
              <option value="">Seleccione un suministro</option>
              <option value="Normal">Normal</option>
              <option value="Urgente">Urgente</option>
            </select>
            <Label className="labels">Proceso Clave (PC):</Label>
            <select id="PC" className="select">
              <option value="">Seleccione el PC</option>
              <option value="PC Educativo">PC Educativo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="division">
            <Label className="labels">Proyecto:</Label>
            <select id="Proyecto" className="select">
              <option value="">Seleccione el Proyecto</option>
              <option value="Proyecto A">Proyecto A</option>
              <option value="Proyecto B">Proyecto B</option>
            </select>
            <Label className="labels">Actividad:</Label>
            <select id="Actividad" className="select">
              <option value="">Seleccione la Actividad</option>
              <option value="Actividad A">Actividad A</option>
              <option value="Actividad B">Actividad B</option>
            </select>
          </div>
          <div className="division">
            <Label className="labels">Cantidad:</Label>
            <Input type="number" id="Cantidad" className="input-small" />
            <Label className="labels">Unidad de medida:</Label>
            <select id="Unidad" className="select">
              <option value="">Seleccione la Unidad</option>
              <option value="Paquete">Paquete</option>
              <option value="Rollo">Rollo</option>
              <option value="Caja">Caja</option>
            </select>
            <Label className="labels">Descripción del bien solicitado:</Label>
            <textarea className="textarea" id="Descripcion"></textarea>
          </div>
          <div className="division">
            <Label className="labels">Firma de Solicitud:</Label>
            <Input type="text" id="Solicitud" className="input-small" />
            <Label className="labels">Firma de Revisión:</Label>
            <Input type="text" id="Revision" className="input-small" />
            <Label className="labels">Firma de Validación:</Label>
            <Input type="text" id="Validacion" className="input-small" />
            <Label className="labels">Firma de Autorización:</Label>
            <Input type="text" id="Autorizacion" className="input-small" />
          </div>
          <div className="division">
            <Label className="labels">Justificación para la adquisición:</Label>
            <textarea className="textarea" id="Justificacion"></textarea>
          </div>
        </div>

        
      </form>
    </div>
  );
};

export default SolicitudPage;
