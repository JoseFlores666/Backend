import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './';

export const TecnicoPage = () => {
    const formRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(new Date());


    return (
        <div className='body2'>
            <div className='formulariodatos' ref={formRef}>
                <div className='division'>
                    <label htmlFor='Folio' className="labels">No. de folio:</label>
                    <input type="number" id='Folio' className='Inputfolio' />
                    <label htmlFor="">Selecciona la fecha:</label>
                    <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} />
                </div>
                <div className='division'>
                    <label htmlFor='Folio' className="labels">Area solicitante:</label>
                    <input type="text" id='Folio' className='Inputfolio' />
                    <label htmlFor="">Solicita:</label>
                    <input type="text" />
                    <label htmlFor="">Edificio:</label>
                    <input type="text" />
                </div>
                <div className='division'>
                    <label className="labels">Tipo de Mantenimiento:</label>
                    <label className="labels">Tipo de Trabajo:</label>
                    <label className="labels">Tipo de Solicitud:</label>

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
                    <select id="PC">
                        <option value="">Seleccione el PC</option>
                        <option value="Educativo">PC Educativo</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                <div className='division'>
                    <label className="labels">Descripción (servicio requerido):</label>
                </div>
                <textarea className='inputs3' id="Justificacion"></textarea>
                <div className='division' style={{backgroundColor:'green'}}>
                    <label className="labels">Llenado Exclusivo para el DEP MSG:</label>
                </div>  
                <div>
                    <label className="labels">Seleccione la fecha de atencion:</label>

                </div>
               
                <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} />

                <div className='division' >
                    <label className="labels">Insumos Solicitados:</label>
                </div>

                <div className='division'>
                    <label className="labels">Cantidad:</label>
                    <label className="labels">Descripcion:</label>
                </div>

                <div className='division' >
                    <select id="Proyecto">
                        <option value="">Seleccione el Proyecto</option>
                        <option value="ProyectoA">Mantenimiento</option>
                        <option value="ProyectoB">Mantenimiento 2</option>
                    </select>

                    <textarea className='inputs3' id="Justificacion"></textarea>
                </div>

               
                <div className='division'>
                    <label className="labels">Observaciones y/o diagnóstico técnico:</label>
                </div>
                <textarea className='inputs3' id="Justificacion"></textarea>
                <div className='botones'>
                <button className="btn-primary">Guardar cambios</button>
                <button className="btn-primary" >Generar PDF</button>
            </div>
            </div>
          
        </div>
    );
};