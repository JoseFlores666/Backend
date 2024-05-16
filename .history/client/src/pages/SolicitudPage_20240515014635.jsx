import React, { useRef } from 'react';
import { Button, Input, Label } from '../components/ui';
import { generatePDF } from '../../util/pdfUtils.js';
import '../../css/solicitud.css';

const SolicitudPage = () => {
  const formRef = useRef(null);

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
    generatePDF(data);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí podrías agregar la lógica para guardar los cambios si lo deseas
    console.log('Formulario enviado');
  };

  return (
    <div className='body2'>
    <form onSubmit={handleSubmit}>
      <div className='formulariodatos' ref={formRef}>
        <div className='division'>
          <Label htmlFor='Folio' className="labels">No. de folio:</Label>
          <Input type="number" id='Folio' className='Inputfolio' />
          <Label htmlFor="">Fecha</Label>
          <div>
            <Input type="number" placeholder="Día" />
            <Input type="number" placeholder="Mes" />
            <Input type="number" placeholder="Año" />
          </div>
        </div>
        <div className='division'>
          <Label className="labels">Tipo de Suministro:</Label>
          <Label className="labels">Proceso Clave (PC):</Label>
        </div>
        <div className='division'>
          <select id="Suministro">
            <option value="">Seleccione un suministro</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
          <select id="PC">
            <option value="">Seleccione el PC</option>
            <option value="PC Educativo">PC Educativo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className='division'>
          <Label className="labels">Proyecto:</Label>
          <Label className="labels">Actividad:</Label>
        </div>
        <div className='division'>
          <select id="Proyecto">
            <option value="">Seleccione el Proyecto</option>
            <option value="Proyecto A">Proyecto A</option>
            <option value="Proyecto B">Proyecto B</option>
          </select>
          <select id="Actividad">
            <option value="">Seleccione la Actividad</option>
            <option value="Actividad A">Actividad A</option>
            <option value="Actividad B">Actividad B</option>
          </select>
        </div>
        <div className='division'>
          <Label className='labels'>Cantidad:</Label>
          <Label className="labels">Unidad de medida:</Label>
          <Label className="labels">Descripción del bien solicitado:</Label>
        </div>
        <div className='division'>
          <Input type="number" id="Cantidad" />
          <select id="Unidad">
            <option value="">Seleccione la Unidad</option>
            <option value="Paquete">Paquete</option>
            <option value="Rollo">Rollo</option>
            <option value="Caja">Caja</option>
          </select>
          <textarea className='inputs3' id="Descripcion"></textarea>
        </div>
        <div className='division'>
          <Label className="labels">Justificación para la adquisición:</Label>
        </div>
        <textarea className='inputs3' id="Justificacion"></textarea>
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