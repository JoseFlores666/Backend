import React, { useRef, useState, useEffect } from "react";
import { generatePDF } from "../util/pdfUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { useParams } from "react-router-dom";
import "../css/solicitud.css";
import "../css/tablas.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papel from '../';
import Papel2 from '../img/Papel2.jpg';

export const RegisterSolicitudPage = () => {
  const { solicitudId } = useParams();
  const formRef = useRef(null);
  const [items, setItems] = useState([{ cantidad: "", unidad: "", descripcion: "" }]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProyecto, setSelectedProyecto] = useState("");
  const [selectedActividad, setSelectedActividad] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [solicitud, setSolicitud] = useState(null);
  const [queryExecuted, setQueryExecuted] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const { getunSolitud, updateSoli, crearmySoli, getIdsProyect, ids, unasoli, getIdsProyectYAct, idsAct = [] } = useSoli();
  const { user } = useAuth();

  useEffect(() => {
    if (solicitudId && !queryExecuted) {
      setIsEditing(true);
      getunSolitud(solicitudId)
        .then((unasoli) => {
          setQueryExecuted(true);
          if (unasoli) {
            setSolicitud(unasoli);
            populateForm(unasoli);
            setSelectedSolicitud(unasoli);
          } else {
            console.error("No solicitud data found");
          }
        })
        .catch((error) => {
          console.error("Error fetching solicitud:", error);
        });
    }
  }, [solicitudId, queryExecuted, getunSolitud]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!projectsLoaded) {
        try {
          await getIdsProyect();
          setProjectsLoaded(true);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };

    fetchProjects();
  }, [projectsLoaded, getIdsProyect]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (selectedProyecto && !activitiesLoaded) {
        try {
          await getIdsProyectYAct(selectedProyecto);
          setActivitiesLoaded(true);
        } catch (error) {
          console.error("Error fetching activities:", error);
        }
      }
    };

    fetchActivities();
  }, [selectedProyecto, activitiesLoaded, getIdsProyectYAct]);

  const handleProyectoChange = (value) => {
    setSelectedProyecto(value);
    setSelectedActividad("");
    setActivitiesLoaded(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = formRef.current;

    const formData = new FormData(form);
    const data = {
      folio: formData.get("Folio"),
      suministro: formData.get("Suministro"),
      pc: formData.get("PC"),
      proyecto: form.querySelector("#Proyecto option:checked").innerText,
      actividad: form.querySelector("#Actividad option:checked").innerText,
      justificacion: formData.get("Justificacion"),
      fecha: selectedDate,
      items,
      firmas: {
        solicitud: formData.get("Solicitud"),
        revision: formData.get("Revision"),
        validacion: formData.get("Validacion"),
        autorizacion: formData.get("Autorizacion"),
      },
      user: user.id,
      estado: "Pendiente",
    };

    if (isEditing) {
      updateSoli(solicitud._id, data)
        .then(() => {
          console.log("Solicitud actualizada", data);
        })
        .catch((error) => {
          console.error("Error updating solicitud:", error);
        });
    } else {
      crearmySoli(data).catch((error) => {
        console.error("Error creating solicitud:", error);
      });
    }
  };

  const handleGeneratePDF = (event) => {
    event.preventDefault();
    const form = formRef.current;
    const data = {
      folio: form.querySelector("#Folio").value,
      suministro: form.querySelector("#Suministro").value,
      pc: form.querySelector("#PC").value,
      proyecto: form.querySelector("#Proyecto option:checked").innerText,
      actividad: form.querySelector("#Actividad option:checked").innerText,
      justificacion: form.querySelector("#Justificacion").value,
      fecha: selectedDate,
      items,
    };
    handleSubmit(event);
    generatePDF(data);
    generarPDF();
  };

  const addItem = () => {
    setItems([...items, { cantidad: "", unidad: "", descripcion: "" }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const populateForm = (solicitud) => {
    const form = formRef.current;
    if (!form || !solicitud) return;

    try {
      form.querySelector("#Folio").value = solicitud.folio || "";
      form.querySelector("#Suministro").value = solicitud.tipoSuministro || "";
      form.querySelector("#PC").value = solicitud.procesoClave || "";
      setSelectedProyecto(solicitud.proyecto || "");
      setSelectedDate(new Date(solicitud.fecha || Date.now()));
      setSelectedActividad(solicitud.actividades || "");
      form.querySelector("#Justificacion").value = solicitud.justificacionAdquisicion || "";

      if (Array.isArray(solicitud.suministros)) {
        setItems(
          solicitud.suministros.map((item) => ({
            cantidad: item.cantidad,
            unidad: item.unidad,
            descripcion: item.descripcion,
          }))
        );
      } else {
        setItems([]);
      }

      setSelectedSolicitud(solicitud);

    } catch (error) {
      console.error("Error populating form:", error);
    }
  };

  const generarPDF = () => {
    const img1 = document.getElementById('image1');
    const img2 = document.getElementById('image2');

    if (!img1 || !img2) {
      console.error('No se encontraron los elementos con ID image1 o image2');
      return;
    }

    const maxItemsPerPage = 10;
    const itemsChunks = [];

    for (let i = 0; i < items.length; i += maxItemsPerPage) {
      itemsChunks.push(items.slice(i, i + maxItemsPerPage));
    }

    itemsChunks.forEach((chunk, pageIndex) => {
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

      if (selectedDate) {
        const [year, month, day] = selectedDate.toISOString().split('T')[0].split('-');
        doc.setFontSize(9);
        doc.text(day, 460, img1Height - 70.3);
        doc.text(month, 505, img1Height - 70.3);
        doc.text(year, 545, img1Height - 70.3);
      } else {
        console.error('Fecha no encontrada en los datos almacenados');
      }

      doc.setFontSize(30);
      if (suministro === "Normal") {
        doc.text('•', 92, img1Height - 5);
      } else {
        doc.text('•', 165, img1Height - 4.9);
      }

      doc.setFontSize(30);
      if (pc === "Educativo") {
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
      <h2 className="labels">{isEditing ? "Actualizar Solicitud" : "Registrar Solicitud"}</h2>
      <form className="formulariodatos" onSubmit={handleSubmit} ref={formRef}>
        <div className="form-group">
          <label className="labels" htmlFor="Folio">Folio:</label>
          <input className="form-control" type="text" id="Folio" name="Folio" />
        </div>
        <div className="form-group">
          <label className="labels" htmlFor="Suministro">Tipo de Suministro:</label>
          <select className="form-control" id="Suministro" name="Suministro">
            <option value="Normal">Normal</option>
            <option value="Extraordinario">Extraordinario</option>
          </select>
        </div>
        <div className="form-group">
          <label className="labels" htmlFor="PC">Proceso Clave:</label>
          <select className="form-control" id="PC" name="PC">
            <option value="Educativo">Educativo</option>
            <option value="Administrativo">Administrativo</option>
          </select>
        </div>
        <div className="form-group">
          <label className="labels" htmlFor="Proyecto">Proyecto:</label>
          <select className="form-control" id="Proyecto" name="Proyecto" value={selectedProyecto} onChange={(e) => handleProyectoChange(e.target.value)}>
            <option value="">Seleccione un proyecto</option>
            {ids.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="labels" htmlFor="Actividad">Actividad:</label>
          <select className="form-control" id="Actividad" name="Actividad" value={selectedActividad} onChange={(e) => setSelectedActividad(e.target.value)}>
            <option value="">Seleccione una actividad</option>
            {idsAct.map((activity) => (
              <option key={activity} value={activity}>
                {activity}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="labels" htmlFor="Justificacion">Justificación de la Adquisición:</label>
          <textarea className="form-control" id="Justificacion" name="Justificacion"></textarea>
        </div>
        <div className="form-group">
          <label className="labels">Fecha:</label>
          <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} dateFormat="yyyy-MM-dd" className="form-control" />
        </div>
        <div className="form-group">
          <label className="labels">Items:</label>
          {items.map((item, index) => (
            <div key={index} className="form-item">
              <input className="form-control" type="text" placeholder="Cantidad" value={item.cantidad} onChange={(e) => handleItemChange(index, "cantidad", e.target.value)} />
              <input className="form-control" type="text" placeholder="Unidad" value={item.unidad} onChange={(e) => handleItemChange(index, "unidad", e.target.value)} />
              <input className="form-control" type="text" placeholder="Descripción" value={item.descripcion} onChange={(e) => handleItemChange(index, "descripcion", e.target.value)} />
            </div>
          ))}
          <button type="button" className="btn-primary" onClick={addItem}>Agregar Ítem</button>
        </div>
        <div className="form-group">
          <label className="labels">Firmas:</label>
          <input className="form-control" type="text" id="Solicitud" name="Solicitud" placeholder="Solicitud" />
          <input className="form-control" type="text" id="Revision" name="Revision" placeholder="Revisión" />
          <input className="form-control" type="text" id="Validacion" name="Validacion" placeholder="Validación" />
          <input className="form-control" type="text" id="Autorizacion" name="Autorizacion" placeholder="Autorización" />
        </div>
        <div className="botones">
          <button type="submit" className="btn-primary">
            {isEditing ? "Guardar cambios" : "Registrar"}
          </button>
          <button type="button" className="btn-primary" onClick={handleGeneratePDF}>
            Generar PDF
          </button>
        </div>
      </form>
      <div style={{ display: 'none' }}>
        <img src={Papel} id="image1" alt="Papel" style={{ height: '100%', width: '100%' }} />
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
                <td>{index === 0 ? `Proyecto: ${selectedProyecto}` : ''}</td>
                <td></td>
                <td>{item.cantidad}</td>
                <td></td>
                <td>{item.unidad}</td>
                <td>{item.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <img src={Papel2} id="image2" alt="Papel2" style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};
