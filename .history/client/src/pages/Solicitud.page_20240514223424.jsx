import React from 'react';
import '../styles/SolicitudStyles.css';

export const SolicitudPage = () => {
  return (
    <div className='body2'>
      <div className='formulariodatos'>
        <div className='division'>
          <label className="labels">No. de folio:</label>
          <input type="number" className='Inputfolio' />

          <label htmlFor="">Fecha</label>
          <label htmlFor="">Dia</label>
          <label htmlFor="">Mes</label>
          <label htmlFor="">Año</label>
        </div>

        <div className='division'>
          <label className="labels">Tipo de Suministro:</label>

          <label className="labels">Proceso Clave (PC):</label>

        </div>
        <div className='division'>
          <select name="" id="">
            <option value="">Seleccione un suministro</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
          <select name="" id="">
            <option value="">Seleccione el PC</option>
            <option value="Normal">PC Educativo</option>
            <option value="Urgente">Otro</option>
          </select>
        </div>

        <div className='division'>
          <label className="labels">Proyecto:</label>


          <label className="labels">Actividad:</label>

        </div>
        <div className='division'>
          <select name="" id="">
            <option value="">Seleccione el PC</option>
            <option value="Normal">PC Educativo</option>
            <option value="Urgente">Otro</option>
          </select>

          <select name="" id="">
            <option value="">Seleccione el PC</option>
            <option value="Normal">PC Educativo</option>
            <option value="Urgente">Otro</option>
          </select>
        </div>

        <div className='division'>
          <label className='labels'>Cantidad:</label>

          <label className="labels">Unidad de medida:</label>

          <label className="labels">Descripcion del bien solicitado:</label>

        </div>

        <div className='division'>
          <input type="number" />

          <select name="" id="">
            <option value="">Seleccione la Unidad</option>
            <option value="Normal">Paquete</option>
            <option value="Urgente">Rollo</option>
            <option value="Urgente">Caja</option>
          </select>
          <textarea name="" className='inputs3' id=""></textarea>
        </div>

        <div className='division'>
          <label className="labels">Justificacion para la adquisición:</label>
        </div>

        <textarea name="" className='inputs3' id=""></textarea>
      </div>

      <div className='botones'>
        <button className="btn-primary">Guardar cambios</button>
        <button className="btn-primary">Generar PDF</button>
      </div>
    </div>
  );
};