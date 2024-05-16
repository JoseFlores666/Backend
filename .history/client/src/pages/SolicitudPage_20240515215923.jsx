import React, { useRef, useState } from 'react';
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { generatePDF } from '../util/pdfUtils.js';
import '../../css/Solicitud.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
export const SolicitudPage = () => {
  const formRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState([{ cantidad: '', unidad: '', descripcion: '' }]);

  const handleGeneratePDF = () => {
    const form = formRef.current;
    const data = {
      folio: form.querySelector('#Folio').value,
      suministro: form.querySelector('#Suministro').value,
      pc: form.querySelector('#PC').value,
      proyecto: form.querySelector('#Proyecto').value,
      actividad: form.querySelector('#Actividad').value,
      justificacion: form.querySelector('#Justificacion').value,
      fecha: selectedDate,
      items,
    };
    generatePDF(data);
  };

  const addItem = () => {
    setItems([...items, { cantidad: '', unidad: '', descripcion: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className='body2'>
      <form className='formulariodatos' onSubmit={handleSubmit} ref={formRef}>
        <div className='division'>
          <label htmlFor='Folio' className="labels">No. de folio:</label>
          <input type="number" id='Folio' className='Inputfolio font-bold' />
          <label htmlFor="" className="labels">Fecha:</label>
          <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} className='select font-bold' />
        </div>
        <div className='division'>
          <label className="labels">Tipo de Suministro:</label>
          <select id="Suministro" className='select font-bold'>
            <option value="">Seleccione un suministro</option>
            <option value="Normal" >Normal</option>
            <option value="Urgente" >Urgente</option>
          </select>
          <label className="labels">Proceso Clave (PC):</label>
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
          <textarea className='inputs3 font-bold' id="Descripcion"></textarea>
        </div>
        <div className='division'>
          <label className="labels">Justificación para la adquisición:</label>
        </div>
        <textarea className='inputs4 font-bold' id="Justificacion"></textarea>
        <div className='botones'>
          <button type="submit" className="btn-primary">Guardar cambios</button>
          <button className="btn-primary" onClick={handleGeneratePDF}>Generar PDF</button>
        </div>
      </form>
    </div>
  );
};

export default SolicitudPage;