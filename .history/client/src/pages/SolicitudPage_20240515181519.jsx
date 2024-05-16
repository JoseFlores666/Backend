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
    <div className="container">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="form">
          <div className="form-group">
            <Label htmlFor="Folio">No. de folio:</Label>
            <Input type="number" id="Folio" className="input-small" />
            <div className="date-inputs">
              <Input type="number" id="Dia" placeholder="Día" />
              <Input type="number" id="Mes" placeholder="Mes" />
              <Input type="number" id="Año" placeholder="Año" />
            </div>
          </div>
          <div className="form-group">
            <Label>Tipo de Suministro:</Label>
            <select id="Suministro" className="select">
              <option value="">Seleccione un suministro</option>
              <option value="Normal">Normal</option>
              <option value="Urgente">Urgente</option>
            </select>
            <Label>Proceso Clave (PC):</Label>
            <select id="PC" className="select">
              <option value="">Seleccione el PC</option>
              <option value="PC Educativo">PC Educativo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="form-group">
            <Label>Proyecto:</Label>
            <select id="Proyecto" className="select">
              <option value="">Seleccione el Proyecto</option>
              <option value="Proyecto A">Proyecto A</option>
              <option value="Proyecto B">Proyecto B</option>
            </select>
            <Label>Actividad:</Label>
            <select id="Actividad" className="select">
              <option value="">Seleccione la Actividad</option>
              <option value="Actividad A">Actividad A</option>
              <option value="Actividad B">Actividad B</option>
            </select>
          </div>
          <div className="form-group">
            <Label>Cantidad:</Label>
            <Input type="number" id="Cantidad" className="input-small" />
            <Label>Unidad de medida:</Label>
            <select id="Unidad" className="select">
              <option value="">Seleccione la Unidad</option>
              <option value="Paquete">Paquete</option>
              <option value="Rollo">Rollo</option>
              <option value="Caja">Caja</option>
            </select>
            <Label>Descripción del bien solicitado:</Label>
            <textarea id="Descripcion" className="textarea"></textarea>
          </div>
          <div className="form-group">
            <Label>Firma de Solicitud:</Label>
            <Input type="text" id="Solicitud" className="input-small" />
            <Label>Firma de Revisión:</Label>
            <Input type="text" id="Revision" className="input-small" />
            <Label>Firma de Validación:</Label>
            <Input type="text" id="Validacion" className="input-small" />
            <Label>Firma de Autorización:</Label>
            <Input type="text" id="Autorizacion" className="input-small" />
          </div>
          <div className="form-group">
            <Label>Justificación para la adquisición:</Label>
            <textarea id="Justificacion" className="textarea"></textarea>
          </div>
        </div>

        <div className="button-group">
          <Button type="submit" className="btn-primary">
            Guardar cambios
          </Button>
          <Button onClick={handleGeneratePDF} className="btn-primary">
            Generar PDF
          </Button>
        </div>
      </form>
    </div>
  );
};
export default SolicitudPage;
