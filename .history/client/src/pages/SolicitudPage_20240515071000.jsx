import React, { useRef, useState } from "react";
import { Button, Input, Label } from "../components/ui";
import { generatePDF } from "../util/pdfUtils.js";
import "../../css/solicitud.css";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";

const SolicitudPage = () => {
  const formRef = useRef(null);
  const { user } = useAuth();

  const id = user.id;
  
  const { crearmySoli } = useSoli();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const form = formRef.current;
    const data = {
      areaSolicitante: form.querySelector("#AreaSolicitante").value,
      tipoSuministro: form.querySelector("#TipoSuministro").value,
      procesoClave: form.querySelector("#ProcesoClave").value,
      area: form.querySelector("#Area").value,
      suministros: [
        {
          cantidad: parseInt(form.querySelector("#Cantidad").value),
          unidadMedida: form.querySelector("#Unidad").value,
          descripcion: form.querySelector("#Descripcion").value,
          cantidadEntregada: 0,
        },
      ],
      proyecto: form.querySelector("#Proyecto").value,
      actividades: form.querySelector("#Actividad").value,
      justificacionAdquisicion: form.querySelector("#Justificacion").value,
      firmas: {
        solicitud: form.querySelector("#Solicitud").value,
        revision: form.querySelector("#Revision").value,
        validacion: form.querySelector("#Validacion").value,
        autorizacion: form.querySelector("#Autorizacion").value,
      },
      user: "id",
      estado: "Pendiente",
    };
  
    crearmySoli(data);
  };
  
  
  
  
  const handleGeneratePDF = () => {
    const form = formRef.current;
    const data = {
      areaSolicitante: form.querySelector("#Suministro").value, // Corregido aquí
      tipoSuministro: form.querySelector("#TipoSuministro").value,
      procesoClave: form.querySelector("#PC").value, // Corregido aquí
      area: form.querySelector("#Proyecto").value, // Corregido aquí
      suministros: [
        {
          cantidad: parseInt(form.querySelector("#Cantidad").value),
          unidadMedida: form.querySelector("#Unidad").value,
          descripcion: form.querySelector("#Descripcion").value,
          cantidadEntregada: 0,
        },
      ],
      proyecto: form.querySelector("#Proyecto").value,
      actividades: form.querySelector("#Actividad").value,
      justificacionAdquisicion: form.querySelector("#Justificacion").value,
      firmas: {
        solicitud: form.querySelector("#Solicitud").value,
        revision: form.querySelector("#Revision").value,
        validacion: form.querySelector("#Validacion").value,
        autorizacion: form.querySelector("#Autorizacion").value,
      },
      user: id, 
      estado: "Pendiente",
    };
    generatePDF(data);
  };
  C