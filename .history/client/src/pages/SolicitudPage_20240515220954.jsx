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

  const handleGuardarCambios = () => {
    const form = formRef.current;
    const data = {
      folio: form.querySelector('#Folio').value,
      areaSolicitante: '', // Aquí debes agregar la lógica para obtener el área solicitante del usuario
      fecha: selectedDate,
      tipoSuministro: form.querySelector('#Suministro').value,
      procesoClave: form.querySelector('#PC').value,
      suministros: items.map(item => ({
        cantidad: parseInt(item.cantidad),
        unidadMedida: item.unidad,
        descripcion: item.descripcion,
        cantidadEntregada: 0 // Inicialmente no se ha entregado ninguna cantidad
      })),
      proyecto: form.querySelector('#Proyecto').value,
      actividades: form.querySelector('#Actividad').value,
      justificacionAdquisicion: form.querySelector('#Justificacion').value,
      firmas: {
        solicitud: '',
        revision: '',
        validacion: '',
        autorizacion: ''
      },
      estado: 'Pendiente' // Estado inicial de la solicitud
    };

    // Llama a la función para enviar a la base de datos
    enviaBase(data);

    // También puedes generar el PDF si lo deseas
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
    <div className='body2 solicitud-form'>
      <div className='formulariodatos' ref={formRef}>
    <div className='body2 solicitud-form'>
      <div className='formulariodatos' ref={formRef}>
        <div className='division'>
          <label htmlFor='Folio' className="labels">No. de folio:</label>
          <input type="number" id='Folio' className='Inputfolio font-bold' />
          <label htmlFor="" className="labels">Selecciona la fecha:</label>
          <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} className='select font-bold' />
        </div>
        <div className='division'>
          <label className="labels">Tipo de Suministro:</label>
          <label className="labels">Proceso Clave (PC):</label>
        </div>
        <div className='division'>
          <select id="Suministro" className='select font-bold'>
            <option value="">Seleccione un suministro</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
          <select id="PC" className='select font-bold'>
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
        {items.map((item, index) => (
          <div className='division' key={index}>
            <label className='labels'>Cantidad:</label>
            <input 
              type="number" 
              value={item.cantidad} 
              onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)} 
              className='Inputs2 font-bold'
            />
            <label className="labels">Unidad de medida:</label>
            <select 
              value={item.unidad} 
              onChange={(e) => handleItemChange(index, 'unidad', e.target.value)}
              className='select font-bold'
            >
              <option value="">Seleccione la Unidad</option>
              <option value="Paquete">Paquete</option>
              <option value="Rollo">Rollo</option>
              <option value="Caja">Caja</option>
            </select>
            <label className="labels">Descripcion del bien solicitado:</label>
            <textarea 
              className='inputs3 font-bold' 
              value={item.descripcion} 
              onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
            ></textarea>
          </div>
        ))}
        <button onClick={addItem} className='btn-primary'>Agregar otra fila</button>
        <div className='division'>
          <label className="labels">Justificacion para la adquisición:</label>
        </div>
        <textarea className='inputs3 font-bold' id="Justificacion"></textarea>
        </div>
      <div className='botones'>
        <button onClick={handleGuardarCambios} className="btn-primary">Guardar cambios</button>
        <button onClick={handleGeneratePDF} className="btn-primary">Generar PDF</button>
      </div>
    </div>
    </div>
  );
};

export default SolicitudPage;