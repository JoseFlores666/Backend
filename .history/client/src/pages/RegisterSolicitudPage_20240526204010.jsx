import React, { useEffect, useState } from "react";
import Papel from "../img/Papel.jpeg";
import Papel2 from "../img/Papel2.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import useFetch from "../util/useFetch.js";

export const RegisterSolicitudPage = () => {
  const [folio, setFolio] = useState("");
  const [fecha, setFecha] = useState("");
  const [suministro, setSuministro] = useState("");
  const [pc, setPc] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [actividad, setActividad] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [items, setItems] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState("");
  const [selectedActividad, setSelectedActividad] = useState("");
  const {
    crearmySoli,
    getIdsProyectYAct,
    getIdsProyect,
    ids, //ids trae los proyectos xd
    idsAct = [],
  } = useSoli();
  const { user } = useAuth();
  const id = user.id;

  const guardarDatos = () => {
    const datosSolicitud = {
      folio,
      fecha,
      suministro,
      pc,
      proyecto,
      actividad,
      justificacion,
      items,
      id,
    };
    setDatos(datosSolicitud);

    console.log("Datos de solicitud:", datosSolicitud);
    crearmySoli(datosSolicitud);
    localStorage.setItem("datosSolicitud", JSON.stringify(datosSolicitud));
    setFolio("");
    setFecha("");
    setSuministro("");
    setPc("");
    setProyecto("");
    setActividad("");
    setJustificacion("");
    setItems([]);

    alert("Datos guardados exitosamente.");
  };

  const agregarItem = () => {
    if (items.length < 10) {
      setItems([...items, { cantidad: "", unidad: "", descripcion: "" }]);
    } else {
      alert("No se pueden agregar más de 10 items.");
    }
  };

  const guardarDatosYGenerarPDF = () => {
    if (
      !folio ||
      !fecha ||
      !suministro ||
      !pc ||
      !proyecto ||
      !actividad ||
      !justificacion ||
      items.length === 0
    ) {
      alert("Por favor, complete todos los campos y agregue al menos un ítem.");
      return;
    }

    const datosSolicitud = {
      folio,
      fecha,
      suministro,
      pc,
      proyecto,
      actividad,
      justificacion,
      items,
    };
    setDatos(datosSolicitud);

    localStorage.setItem("datosSolicitud", JSON.stringify(datosSolicitud));
  };

  const [datos, setDatos] = useState({
    folio: "",
    fecha: "",
    suministro: "",
    pc: "",
    proyecto: "",
    actividad: "",
    justificacion: "",
    items: [],
  });

  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("datosSolicitud"));
    if (datosGuardados) {
      setFolio(datosGuardados.folio);
      setFecha(datosGuardados.fecha);
      setSuministro(datosGuardados.suministro);
      setPc(datosGuardados.pc);
      setProyecto(datosGuardados.proyecto);
      setActividad(datosGuardados.actividad);
      setJustificacion(datosGuardados.justificacion);
      setItems(datosGuardados.items);
    }
  }, []);

  const handleProyectoChange = async (value) => {
    setSelectedProyecto(value);
    setSelectedActividad("");
    setActivitiesLoaded(false);
    try {
      await getIdsProyectYAct(value);
      setActivitiesLoaded(true);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

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

  function generarPDF() {
    const img1 = document.getElementById("image1");
    const img2 = document.getElementById("image2");

    if (!img1 || !img2) {
      console.error("No se encontraron los elementos con ID image1 o image2");
      return;
    }

    const datos = JSON.parse(localStorage.getItem("datosSolicitud"));
    if (!datos) {
      console.error("Datos no encontrados en el localStorage");
      return;
    }

    const maxItemsPerPage = 10;
    const itemsChunks = [];

    for (let i = 0; i < datos.items.length; i += maxItemsPerPage) {
      itemsChunks.push(datos.items.slice(i, i + maxItemsPerPage));
    }

    itemsChunks.forEach((items, pageIndex) => {
      const doc = new jsPDF("p", "pt", "letter");

      const canvas1 = document.createElement("canvas");
      const context1 = canvas1.getContext("2d");
      canvas1.width = img1.width;
      canvas1.height = img1.height;
      context1.drawImage(img1, 0, 0, img1.width, img1.height);
      const imgData1 = canvas1.toDataURL("image/jpeg");

      const canvas2 = document.createElement("canvas");
      const context2 = canvas2.getContext("2d");
      canvas2.width = img2.width;
      canvas2.height = img2.height;
      context2.drawImage(img2, 0, 0, img2.width, img2.height);
      const imgData2 = canvas2.toDataURL("image/jpeg");

      const img1Height = (img1.height * 600) / img1.width;
      const img2Height = (img2.height * 600) / img2.width;

      doc.addImage(imgData1, "JPEG", 0, 0, 600, img1Height);

      doc.autoTable({
        html: "#miTabla",
        startY: img1Height + 3,
        margin: { top: 0, bottom: 0, left: 30, right: 100 },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          valign: "middle",
          halign: "center",
          textColor: [0, 0, 0],
          fillColor: [255, 255, 255],
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          cellHeight: "auto",
        },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 50 },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },
          4: { cellWidth: 50 },
          5: { cellWidth: 200 },
          6: { cellWidth: 50 },
        },
        rowPageBreak: "auto",
      });

      if (datos.fecha) {
        const [year, month, day] = datos.fecha.split("-");

        doc.setFontSize(9);
        doc.text(day, 460, img1Height - 70.3);
        doc.text(month, 505, img1Height - 70.3);
        doc.text(year, 545, img1Height - 70.3);
      } else {
        console.error("Fecha no encontrada en los datos almacenados");
      }

      doc.setFontSize(30);
      if (datos.suministro === "Normal") {
        doc.text("•", 92, img1Height - 5);
      } else {
        doc.text("•", 165, img1Height - 4.9);
      }

      doc.setFontSize(30);
      if (datos.pc === "Educativo") {
        doc.text("•", 304, img1Height - 22);
      } else {
        doc.text("•", 298, img1Height - 1);
      }

      doc.addImage(
        imgData2,
        "JPEG",
        0,
        doc.previousAutoTable.finalY,
        600,
        img2Height
      );

      doc.save(`solicitud_page_${pageIndex + 1}.pdf`);
    });
  }

  return (
    <div className="body2">
      <div className="formulariodatos" id="formRef">
        <div className="division">
          <label htmlFor="Folio" className="labels">
            No. de folio:
          </label>
          <input
            type="number"
            id="Folio"
            className="Inputfolio"
            value={folio}
            onChange={(e) => setFolio(e.target.value)}
          />
        </div>
        <div className="division">
          <label htmlFor="Fecha" className="labels">
            Fecha de solicitud:
          </label>
          <input
            type="date"
            id="Fecha"
            className="Inputfolio"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div className="division">
          <label htmlFor="Suministro" className="labels">
            Tipo de suministro:
          </label>
          <select
            id="Suministro"
            className="Inputfolio"
            value={suministro}
            onChange={(e) => setSuministro(e.target.value)}
          >
            <option value="">Seleccione</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>
        <div className="division">
          <label htmlFor="PC" className="labels">
            Tipo de PC:
          </label>
          <select
            id="PC"
            className="Inputfolio"
            value={pc}
            onChange={(e) => setPc(e.target.value)}
          >
            <option value="">Seleccione</option>
            <option value="Educativo">Educativo</option>
            <option value="Administrativo">Administrativo</option>
          </select>
        </div>
        <div className="division">
          <label htmlFor="Proyecto" className="labels">
            Selecciona un proyecto:
          </label>
          <select
            id="Proyecto"
            className="Inputfolio"
            value={selectedProyecto}
            onChange={(e) => handleProyectoChange(e.target.value)}
          >
            <option value="">Seleccione un proyecto</option>
            {ids.map((proyecto) => (
              <option key={proyecto.id} value={proyecto.id}>
                {proyecto.nombreProyecto}
              </option>
            ))}
          </select>
        </div>
        <div className="division">
          <label htmlFor="Actividad" className="labels">
            Selecciona una actividad:
          </label>
          <select
            id="Actividad"
            className="Inputfolio"
            value={selectedActividad}
            onChange={(e) => setSelectedActividad(e.target.value)}
          >
            <option value="">Seleccione una actividad</option>
            {activitiesLoaded && idsAct.length > 0 ? (
              idsAct.map((actividad) => (
                <option key={actividad.id} value={actividad.id}>
                  {actividad.nombreActividad}
                </option>
              ))
            ) : (
              <option value="">No hay actividades disponibles</option>
            )}
          </select>
        </div>
        <div className="division">
          <label htmlFor="Justificacion" className="labels">
            Justificación:
          </label>
          <textarea
            id="Justificacion"
            className="Inputfolio"
            value={justificacion}
            onChange={(e) => setJustificacion(e.target.value)}
          ></textarea>
        </div>
        <div className="division">
          <button className="btnAgregarItem" onClick={agregarItem}>
            Agregar Ítem
          </button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="division">
            <label htmlFor={`cantidad-${index}`} className="labels">
              Cantidad:
            </label>
            <input
              type="number"
              id={`cantidad-${index}`}
              className="Inputfolio"
              value={item.cantidad}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].cantidad = e.target.value;
                setItems(newItems);
              }}
            />
            <label htmlFor={`unidad-${index}`} className="labels">
              Unidad:
            </label>
            <input
              type="text"
              id={`unidad-${index}`}
              className="Inputfolio"
              value={item.unidad}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].unidad = e.target.value;
                setItems(newItems);
              }}
            />
            <label htmlFor={`descripcion-${index}`} className="labels">
              Descripción:
            </label>
            <textarea
              id={`descripcion-${index}`}
              className="Inputfolio"
              value={item.descripcion}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].descripcion = e.target.value;
                setItems(newItems);
              }}
            ></textarea>
          </div>
        ))}
        <div className="division">
          <button className="btnGuardar" onClick={guardarDatos}>
            Guardar Datos
          </button>
          <button className="btnGenerarPDF" onClick={guardarDatosYGenerarPDF}>
            Guardar Datos y Generar PDF
          </button>
        </div>
      </div>
      <img
        id="image1"
        src={Papel}
        alt="Papel"
        style={{ display: "none" }}
      />
      <img
        id="image2"
        src={Papel2}
        alt="Papel2"
        style={{ display: "none" }}
      />
    </div>
  );
};
