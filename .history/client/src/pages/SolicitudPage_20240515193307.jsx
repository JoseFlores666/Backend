import React, { useRef,useState } from 'react';
import { generatePDF } from '../util/pdfUtils.js';
import '../../css/Solicitud.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const SolicitudPage = () => {
  const formRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  
  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   const form = formRef.current;
  //   const data = {
  //     folio: form.querySelector("#Folio").value,

  //     tipoSuministro: form.querySelector("#Suministro").value,
  //     procesoClave: form.querySelector("#PC").value,
  //     proyecto: form.querySelector("#Proyecto").value,
  //     actividad: form.querySelector("#Actividad").value,
  //     cantidad: parseInt(form.querySelector("#Cantidad").value),
  //     unidad: form.querySelector("#Unidad").value,
  //     descripcion: form.querySelector("#Descripcion").value,
  //     justificacion: form.querySelector("#Justificacion").value,
  //     firmas: {
  //       solicitud: form.querySelector("#Solicitud").value,
  //       revision: form.querySelector("#Revision").value,
  //       validacion: form.querySelector("#Validacion").value,
  //       autorizacion: form.querySelector("#Autorizacion").value,
  //     },
  //     user: user.id,
  //     estado: "Pendiente",
  //   };
  //   console.log(data);
  //   crearmySoli(data);
  // };
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
      <div className='formulariodatos' ref={formRef}>
        <div className='division'>
          <label htmlFor='Folio'  className="labels">No. de folio:</label>
          <input type="number"  id='Folio' className='Inputfolio' />
          <label htmlFor="">Selecciona la fecha:</label>
          <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} />

        </div>
        <div className='division'>
          <label className="labels">Tipo de Suministro:</label>
          <label className="labels">Proceso Clave (PC):</label>
        </div>
        <div className='division'>
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
        </div>
        <div className='division'>
          <label className="labels">Proyecto:</label>
          <label className="labels">Actividad:</label>
        </div>
        <div className='division'>
          <select id="Proyecto">
            <option value="">Seleccione el Proyecto</option>
            <option value="ProyectoA">Mantenimiento</option>
            <option value="ProyectoB">Mantenimiento 2</option>
          </select>
          <select id="Actividad" >
            <option value="" >Seleccione la Actividad</option>
            <option value="Actividad A">Verificación de la verificación del programa anual  de mantenimiento</option>
            <option value="Actividad B">Actividad B</option>
          </select>
        </div>
        <div className='division'>
          <label className='labels'>Cantidad:</label>
          <label className="labels">Unidad de medida:</label>
          <label className="labels">Descripcion del bien solicitado:</label>
        </div>
        <div className='division'>
          <input type="number" id="Cantidad" />
          <select id="Unidad">
            <option value="">Seleccione la Unidad</option>
            <option value="Paquete">Paquete</option>
            <option value="Rollo">Rollo</option>
            <option value="Caja">Caja</option>
          </select>
          <textarea className='inputs3' id="Descripcion"></textarea>
        </div>
        <div className='division'>
          <label className="labels">Justificacion para la adquisición:</label>
        </div>
        <textarea className='inputs3' id="Justificacion"></textarea>
      </div>
      <div className='botones'>
        <button className="btn-primary">Guardar cambios</button>
        <button className="btn-primary" onClick={handleGeneratePDF}>Generar PDF</button>
      </div>
    </div>
  );
};