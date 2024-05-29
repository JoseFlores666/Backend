import React, { useEffect, useState } from 'react';
import Papel from '../img/Papel.jpeg';
import Papel2 from '../img/Papel2.jpg';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const RegisterSolicitudPage = () => {
  const [formData, setFormData] = useState({
    folio: '',
    fecha: '',
    suministro: '',
    pc: '',
    proyecto: '',
    actividad: '',
    justificacion: '',
    items: [],
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem('datosSolicitud'));
    if (datosGuardados) {
      setFormData(datosGuardados);
      setItems(datosGuardados.items);
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const agregarItem = () => {
    if (items.length < 10) {
      setItems([...items, { cantidad: '', unidad: '', descripcion: '' }]);
    } else {
      alert('No se pueden agregar más de 10 items.');
    }
  };

  const guardarDatos = () => {
    if (!formData.folio || !formData.fecha || !formData.suministro || !formData.pc || !formData.proyecto || !formData.actividad || !formData.justificacion || items.length === 0) {
      alert('Por favor, complete todos los campos y agregue al menos un ítem.');
      return;
    }

    const datosSolicitud = {
      ...formData,
      items,
    };

    localStorage.setItem('datosSolicitud', JSON.stringify(datosSolicitud));
    setFormData({
      folio: '',
      fecha: '',
      suministro: '',
      pc: '',
      proyecto: '',
      actividad: '',
      justificacion: '',
      items: [],
    });
    setItems([]);
    alert('Datos guardados exitosamente.');
  };

  const generarPDF = () => {
    const img1 = document.getElementById('image1');
    const img2 = document.getElementById('image2');

    if (!img1 || !img2) {
      console.error('No se encontraron los elementos con ID image1 o image2');
      return;
    }

    const datos = JSON.parse(localStorage.getItem('datosSolicitud'));
    if (!datos) {
      console.error('Datos no encontrados en el localStorage');
      return;
    }

    const maxItemsPerPage = 10;
    const itemsChunks = [];

    for (let i = 0; i < datos.items.length; i += maxItemsPerPage) {
      itemsChunks.push(datos.items.slice(i, i + maxItemsPerPage));
    }

    itemsChunks.forEach((items, pageIndex) => {
      const doc = new jsPDF('p', 'pt', 'letter');

      const canvas1 = document.createElement('canvas');
      const context1 = canvas1.getContext('2d');
      canvas1.width = img1.width;
      canvas1.height = img1.height;
      context1.drawImage(img1, 0, 0, img1.width, img1.height);
      const imgData1 = canvas1.toDataURL('image/jpeg');

      const canvas2 = document.createElement('canvas');
      const context2 = canvas2.getContext('2d');
      canvas2.width = img2.width;
      canvas2.height = img2.height;
      context2.drawImage(img2, 0, 0, img2.width, img2.height);
      const imgData2 = canvas2.toDataURL('image/jpeg');

      const img1Height = img1.height * 600 / img1.width;
      const img2Height = img2.height * 600 / img2.width;

      doc.addImage(imgData1, 'JPEG', 0, 0, 600, img1Height);

      doc.autoTable({
        html: '#miTabla',
        startY: img1Height + 3,
        margin: { top: 0, bottom: 0, left: 30, right: 100 },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          valign: 'middle',
          halign: 'center',
          textColor: [0, 0, 0],
          fillColor: [255, 255, 255],
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          cellHeight: 'auto'
        },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 50 },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },
          4: { cellWidth: 50 },
          5: { cellWidth: 200 },
          6: { cellWidth: 50 }
        },
        rowPageBreak: 'auto',
      });

      if (datos.fecha) {
        const [year, month, day] = datos.fecha.split('-');
        doc.setFontSize(9);
        doc.text(day, 460, img1Height - 70.3);
        doc.text(month, 505, img1Height - 70.3);
        doc.text(year, 545, img1Height - 70.3);
      } else {
        console.error('Fecha no encontrada en los datos almacenados');
      }

      doc.setFontSize(30);
      if (datos.suministro === "Normal") {
        doc.text('•', 92, img1Height - 5);
      } else {
        doc.text('•', 165, img1Height - 4.9);
      }

      doc.setFontSize(30);
      if (datos.pc === "Educativo") {
        doc.text('•', 304, img1Height - 22);
      } else {
        doc.text('•', 298, img1Height - 1);
      }

      doc.addImage(imgData2, 'JPEG', 0, doc.previousAutoTable.finalY, 600, img2Height);

      doc.save(`solicitud_page_${pageIndex + 1}.pdf`);
    });
  };

  return (
    <div className="body2">
      <div className="formulariodatos" id="formRef">
        <div className="division">
          <label htmlFor="folio" className="labels">No. de folio:</label>
          <input
            type="number"
            id="folio"
            className="Inputfolio"
            value={formData.folio}
            onChange={handleInputChange}
          />
          <label>Selecciona la fecha:</label>
          <input
            type="date"
            id="fecha"
            value={formData.fecha}
            onChange={handleInputChange}
          />
        </div>
        <div className="division">
          <label className="labels">Tipo de Suministro:</label>
          <label className="labels">Proceso Clave (PC):</label>
        </div>
        <div className="division">
          <select
            id="suministro"
            value={formData.suministro}
            onChange={handleInputChange}
          >
            <option value="">Seleccione un suministro</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
          <select id="pc" value={formData.pc} onChange={handleInputChange}>
            <option value="">Seleccione el PC</option>
            <option value="Educativo">PC Educativo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="division">
          <label className="labels">Proyecto:</label>
          <label className="labels">Actividad:</label>
        </div>
        <div className="division">
          <select
            id="proyecto"
            value={formData.proyecto}
            onChange={handleInputChange}
          >
            <option value="">Seleccione el Proyecto</option>
            <option value="ProyectoA">Mantenimiento</option>
            <option value="ProyectoB">Mantenimiento 2</option>
          </select>
          <select
            id="actividad"
            value={formData.actividad}
            onChange={handleInputChange}
          >
            <option value="">Seleccione la Actividad</option>
            <option value="Actividad A">Verificación de la verificación del programa anual de mantenimiento</option>
            <option value="Actividad B">Actividad B</option>
          </select>
        </div>
        <div id="itemsContainer">
          {items.map((item, index) => (
            <div key={index} className="division">
              <label className="labels">Cantidad:</label>
              <input
                type="number"
                className="item-cantidad"
                value={item.cantidad}
                onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
              />
              <label className="labels">Unidad de medida:</label>
              <select
                className="item-unidad"
                value={item.unidad}
                onChange={(e) => handleItemChange(index, 'unidad', e.target.value)}
              >
                <option value="">Seleccione la Unidad</option>
                <option value="Paquete">Paquete</option>
                <option value="Rollo">Rollo</option>
                <option value="Caja">Caja</option>
              </select>
              <label className="labels">Descripcion del bien solicitado:</label>
              <textarea
                className="inputs3 item-descripcion"
                value={item.descripcion}
                onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
              ></textarea>
            </div>
          ))}
          <button onClick={agregarItem}>Agregar Item</button>
        </div>
        <button type="button" onClick={guardarDatos}>Guardar cambios</button>
        <button onClick={generarPDF}>Generar PDF</button>
        
        <div className="division">
          <label className="labels">Justificacion para la adquisición:</label>
        </div>
        <textarea
          className="inputs3"
          id="justificacion"
          value={formData.justificacion}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div style={{display:'none'}}>
        <img src={Papel} id='image1' alt="Papel" style={{ height: '100%', width: '100%' }} />
        <table id="miTabla" className="tabla">
          <thead>
            <tr>
              <th rowSpan="2">POA</th>
              <th style={{ width: '80px' }} rowSpan="2">PPTO.</th>
              <th colSpan="2">CANTIDAD</th>
              <th rowSpan="2">UNIDAD DE MEDIDA</th>
              <th style={{ width: '200px' }} rowSpan="2">DESCRIPCION DEL BIEN SOLICITADO</th>
              <th rowSpan="2">CANT. ENT.</th>
            </tr>
            <tr>
              <th>SOLIC.</th>
              <th>POA</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index === 0 ? `Proyecto: ${formData.proyecto}` : null}</td>
                <td></td>
                <td>{item.cantidad}</td>
                <td></td>
                <td>{item.unidad}</td>
                <td>{item.descripcion}</td>
              </tr>
            ))}
            <tr>
              <td rowSpan="">{items.length ? `Actividad: ${formData.actividad}` : null}</td>
              <td colSpan="6">{formData.justificacion}</td>
            </tr>
          </tbody>
        </table>
        <img src={Papel2} id='image2' alt="Papel2" style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};
