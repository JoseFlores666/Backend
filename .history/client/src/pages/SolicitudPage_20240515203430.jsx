import React, { useRef, useState } from 'react';
import { generatePDF } from '../util/pdfUtils.js';
import '../../css/Solicitud.css';
import { crearmySoli } from "../context/SolicitudContext.jsx";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const SolicitudPage = () => {
  const formRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
 

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
      fecha: selectedDate // Agrega la fecha seleccionada al objeto de datos
    };
    crearmySolidata); // Puedes enviar los datos aquí a través de una solicitud a la API o hacer lo que necesites con ellos
  };

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
      fecha: selectedDate // Agrega la fecha seleccionada al objeto de datos
    };
    generatePDF(data);
  };

  return (
    <div className='body2'>
      <form className='formulariodatos' ref={formRef} onSubmit={handleSubmit}>
        <div className='division'>
          <label htmlFor='Folio' className="labels">No. de folio:</label>
          <input type="number" id='Folio' className='Inputfolio font-bold' />
          <label htmlFor="" className="labels">Fecha:</label>
          <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} className='select font-bold' />
        </div>
        <div className='division'>
          <label className="labels">Tipo de Suministro:</label>
          <label className="labels">Proceso Clave (PC):</label>
        </div>
        <div className='division'>
          <select id="Suministro" className='select font-bold'>
            <option value="">Seleccione un suministro</option>
            <option value="Normal" >Normal</option>
            <option value="Urgente" >Urgente</option>
          </select>
          <select id="PC" className='select font-bold'>
            <option value="" >Seleccione el PC</option>
            <option value="Educativo" >PC Educativo</option>
            <option value="Otro" >Otro</option>
          </select>
        </div>
        <div className='division'>
          <label className="labels">Proyecto:</label>
          <label className="labels">Actividad:</label>
        </div>
        <div className='division'>
          <select id="Proyecto" className='select font-bold'>
            <option value="" >Seleccione el Proyecto</option>
            <option value="ProyectoA" >Mantenimiento</option>
            <option value="ProyectoB" >Mantenimiento 2</option>
          </select>
          <select id="Actividad" className='select font-bold'>
            <option value="" >Seleccione la Actividad</option>
            <option value="Actividad A" >Verificación de la verificación del programa anual de mantenimiento</option>
            <option value="Actividad B" >Actividad B</option>
          </select>
        </div>
        <div className='division'>
          <label className='labels'>Cantidad:</label>
          <label className="labels">Unidad de medida:</label>
          <label className="labels">Descripcion del bien solicitado:</label>
        </div>
        <div className='division'>
          <input type="number" id="Cantidad" className='Inputs2 font-bold' />
          <select id="Unidad" className='select font-bold'>
            <option value="">Seleccione la Unidad</option>
            <option value="Paquete" >Paquete</option>
            <option value="Rollo" >Rollo</option>
            <option value="Caja" >Caja</option>
          </select>
          <textarea className='inputs3' id="Descripcion"></textarea>
        </div>
        <div className='division'>
          <label className="labels">Justificación para la adquisición:</label>
        </div>
        <textarea className='inputs4' id="Justificacion"></textarea>
        <div className='botones'>
          <button type="submit" className="btn-primary">Guardar cambios</button>
          <button className="btn-primary" onClick={handleGeneratePDF}>Generar PDF</button>
        </div>
      </form>
    </div>
  );
};
