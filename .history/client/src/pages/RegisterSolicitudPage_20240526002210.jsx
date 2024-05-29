import React, { useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { useParams } from "react-router-dom";
import "../css/solicitud.css";
import "../css/tablas.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
        margin: { top: 0, bottom: 0, left: 5, right: 5 },
        head: [['POA', 'PPTO.', 'CANTIDAD', 'UNIDAD DE MEDIDA', 'DESCRIPCION DEL BIEN SOLICITADO', 'CANT. ENT.']],
        body: chunk.map((item, index) => ([
          index === 0 ? `Proyecto: ${selectedProyecto}` : '',
          '',
          item.cantidad,
          '',
          item.unidad,
          item.descripcion,
        ])),
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 50 },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },
          4: { cellWidth: 200 },
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
    <div className="division">
      <label className="labels" style={{ marginRight: "20%" }}>
        Folio:
        <input type="text" name="Folio" className="labels" id="Folio" />
      </label>
      <label className="labels" style={{ marginLeft: "20%" }}>
        Fecha:
        <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
      </label>
    </div>
    <div className="division">
      <label className="labels" style={{ marginRight: "20%" }}>
        Suministro:
        <select name="Suministro" id="Suministro" className="select" required>
          <option value="Normal">Normal</option>
          <option value="Urgente">Urgente</option>
        </select>
      </label>
      <label className="labels" style={{ marginLeft: "20%" }}>
        Proceso Clave:
        <select name="PC" id="PC" className="select" required>
          <option value="Educativo">Educativo</option>
          <option value="Administrativo">Administrativo</option>
        </select>
      </label>
    </div>
    <div className="division">
      <label className="labels" style={{ marginRight: "20%" }}>
        Proyecto:
        <select
          name="Proyecto"
          id="Proyecto"
          className="select"
          value={selectedProyecto}
          onChange={(e) => handleProyectoChange(e.target.value)}
        >
          <option value="">Selecciona un proyecto</option>
          {ids.map((proyecto) => (
            <option key={proyecto._id} value={proyecto._id}>
              {proyecto.nombre}
            </option>
          ))}
        </select>
      </label>
      <label className="labels" style={{ marginLeft: "20%" }}>
        Actividad:
        <select
          name="Actividad"
          id="Actividad" className="select" required
          value={selectedActividad}
          onChange={(e) => setSelectedActividad(e.target.value)}
        >
          <option value="">Selecciona una actividad</option>
          {idsAct.map((actividad) => (
            <option key={actividad._id} value={actividad._id}>
              {actividad.nombre}
            </option>
          ))}
        </select>
      </label>
    </div>ct>
      </label>
      <label className="labels">
        Justificación:
        <textarea name="Justificacion" id="Justificacion" className="Inputs2" />
      </label>
      <div>
        <button type="button" className="btn-primary" onClick={addItem}>
          Añadir Item
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="item">
          <label className="labels">
            Cantidad:
            <input
              type="number"
              value={item.cantidad}
              onChange={(e) => handleItemChange(index, "cantidad", e.target.value)}
            />
          </label>
          <label className="labels">Unidad de medida:</label>
                <select
                  value={item.unidad}
                  onChange={(e) => handleItemChange(index, "unidad", e.target.value)}
                  className="select"
                  name={`Unidad_${index}`}
                  required
                >
                  <option value="">Seleccione la Unidad</option>
                  <option value="Paquete">Paquete</option>
                  <option value="Rollo">Rollo</option>
                  <option value="Caja">Caja</option>
                </select>
          <label className="labels">
            Descripción:
            <textarea
              value={item.descripcion} className="Inputs2"
              onChange={(e) => handleItemChange(index, "descripcion", e.target.value)}
            />
          </label>
        </div>
      ))}
      <button type="submit" className="btn-primary">{isEditing ? "Actualizar Solicitud" : "Registrar Solicitud"}</button>
      <button onClick={handleGeneratePDF} className="btn-primary">Generar PDF</button>
    </form>
  </div>
);
};
