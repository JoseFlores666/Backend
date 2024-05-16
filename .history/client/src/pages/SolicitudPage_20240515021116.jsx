import React, { useRef, useState } from 'react';
import { Button, Input, Label } from '../components/ui';
import { generatePDF } from '../util/pdfUtils.js';
import '../../css/solicitud.css';

const SolicitudPage = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState(null);

  const handleGeneratePDF = () => {
    const form = formRef.current;
    const data = {
      folio: form.querySelector('#Folio').value,
      suministro: form.querySelector('#Suministro').value,
      pc: form.querySelector('#PC').value,
      proyecto: form.querySelector('#Proyecto').value,
      actividad: form.querySelector('#Actividad').value,
      cantidad: form.querySelector('#Cantidad').value,
      unidad: form.querySelector('#Unidad').value,
      descripcion: form.querySelector('#Descripcion').value,
      justificacion: form.querySelector('#Justificacion').value,
    };
    setFormData(data); // Guardar los datos del formulario en el estado
    generatePDF(data);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = formRef.current;
    const data = {
      folio: form.querySelector('#Folio').value,
      suministro: form.querySelector('#Suministro').value,
      pc: form.querySelector('#PC').value,
      proyecto: form.querySelector('#Proyecto').value,
      actividad: form.querySelector('#Actividad').value,
      cantidad: form.querySelector('#Cantidad').value,
      unidad: form.querySelector('#Unidad').value,
      descripcion: form.querySelector('#Descripcion').value,
      justificacion: form.querySelector('#Justificacion').value,
    };
    console.log('Datos del formulario:', data); // Aquí puedes hacer lo que desees con los datos, como enviarlos a un servidor
  };

  return (
    <div className='body2'>
      <form onSubmit={handleSubmit}>
        <div className='formulariodatos' ref={formRef}>
         
        </div>
        <div className='botones'>
          <Button type="submit" className="btn-primary">Guardar cambios</Button>
          <Button className="btn-primary" onClick={handleGeneratePDF}>Generar PDF</Button>
        </div>
      </form>
    </div>
  );
};

export default SolicitudPage;
