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
  const [SelectedProyecto, setSelectedProyecto] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [actividad, setActividad] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [items, setItems] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);
  
  const {
    crearmySoli,
    getIdsProyectYAct,
    getIdsProyect,
    ids,
    idsAct = [],
  } = useSoli();
  const { user } = useAuth();
  const id = user.id;

  const guardarDatos = () => {
    // Guardar los datos del formulario en el estado
    const datosSolicitud = {
      folio,
      fecha,
      suministro,
      pc,
      proyecto: SelectedProyecto, // Usar el id del proyecto seleccionado
      actividad,
      justificacion,
      items,
      id,
    };
    setDatos(datosSolicitud);

    console.log("Datos de solicitud:", datosSolicitud);
    crearmySoli(datosSolicitud);
    // Guardar los datos en localStorage
    localStorage.setItem("datosSolicitud", JSON.stringify(datosSolicitud));
    // Limpiar campos
    setFolio("");
    setFecha("");
    setSuministro("");
    setPc("");
    setSelectedProyecto(""); // Limpiar el proyecto seleccionado
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
      !SelectedProyecto || // Usar el id del proyecto seleccionado
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
      proyecto: SelectedProyecto, // Usar el id del proyecto seleccionado
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
    // Cargar datos guardados desde localStorage al cargar la página
    const datosGuardados = JSON.parse(localStorage.getItem("datosSolicitud"));
    if (datosGuardados) {
      setFolio(datosGuardados.folio);
      setFecha(datosGuardados.fecha);
      setSuministro(datosGuardados.suministro);
      setPc(datosGuardados.pc);
      setSelectedProyecto(datosGuardados.proyecto); // Usar el id del proyecto guardado
      setActividad(datosGuardados.actividad);
      setJustificacion(datosGuardados.justificacion);
      setItems(datosGuardados.items);
    }
  }, []);

  const handleProyectoChange = (value) => {
    setSelectedProyecto(value);
    setActividad(""); // Limpiar la actividad seleccionada
    setActivitiesLoaded(false);
  };

  useEffect(() => {
    const fetchActivities = async () => {
      if (SelectedProyecto && !activitiesLoaded) {
        try {
          await getIdsProyectYAct(SelectedProyecto); // Usar el id del proyecto seleccionado
          setActivitiesLoaded(true);
        } catch (error) {
          console.error("Error fetching activities:", error);
        }
      }
    };

    fetchActivities();
  }, [SelectedProyecto, activitiesLoaded, getIdsProyectYAct]);

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
      const doc = new jsPDF("p", "pt", "letter"); // Tamaño carta

      // Convertir imágenes a base64
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

      // Calcular las posiciones de las imágenes y la tabla
      const img1Height = (img1.height * 600) / img1.width;
      const img2Height = (img2.height * 600) / img2.width;

      // Agregar la primera imagen al PDF
      doc.addImage(imgData1, "JPEG", 0, 0, 600, img1Height);

      // Usar autoTable para generar la tabla del HTML al PDF
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

      // Obtener la fecha del localStorage
      if (datos.fecha) {
        const [year, month, day] = datos.fecha.split("-");

        // Agregar la fecha seleccionada al PDF
        doc.setFontSize(9); // Establecer el tamaño de la fuente
        doc.text(day, 443, 70); // Posición de día (x, y)
        doc.text(month, 484, 70); // Posición de mes (x, y)
        doc.text(year, 535, 70); // Posición de año (x, y)
      }

      // Agregar la segunda imagen al PDF
      doc.addImage(imgData2, "JPEG", 0, 730, 600, img2Height);

      // Guardar el PDF con un nombre único por cada iteración
      doc.save(`Solicitud_${pageIndex + 1}.pdf`);
    });
  }

  return (
    <div>
      <h1>Formulario de Solicitud</h1>
      <div className="form-group">
        <label htmlFor="folio">Folio:</label>
        <input
          type="text"
          id="folio"
          value={folio}
          onChange={(e) => setFolio(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="fecha">Fecha:</label>
        <input
          type="date"
          id="fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="suministro">Suministro:</label>
        <input
          type="text"
          id="suministro"
          value={suministro}
          onChange={(e) => setSuministro(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="pc">Punto de Compra:</label>
        <input
          type="text"
          id="pc"
          value={pc}
          onChange={(e) => setPc(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="proyecto">Proyecto:</label>
        <select
          id="proyecto"
          value={SelectedProyecto}
          onChange={(e) => handleProyectoChange(e.target.value)}
        >
          <option value="">Seleccione un proyecto</option>
          {ids &&
            ids.map((proyecto) => (
              <option key={proyecto.id} value={proyecto.id}>
                {proyecto.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="actividad">Actividad:</label>
        <select
          id="actividad"
          value={actividad}
          onChange={(e) => setActividad(e.target.value)}
        >
          <option value="">Seleccione una actividad</option>
          {idsAct &&
            idsAct.map((actividad) => (
              <option key={actividad.id} value={actividad.id}>
                {actividad.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="justificacion">Justificación:</label>
        <textarea
          id="justificacion"
          value={justificacion}
          onChange={(e) => setJustificacion(e.target.value)}
        ></textarea>
      </div>
      <div className="form-group">
        <label>Items:</label>
        <button type="button" onClick={agregarItem}>
          Agregar Ítem
        </button>
        {items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Cantidad"
              value={item.cantidad}
              onChange={(e) =>
                setItems(
                  items.map((item, i) =>
                    i === index ? { ...item, cantidad: e.target.value } : item
                  )
                )
              }
            />
            <input
              type="text"
              placeholder="Unidad"
              value={item.unidad}
              onChange={(e) =>
                setItems(
                  items.map((item, i) =>
                    i === index ? { ...item, unidad: e.target.value } : item
                  )
                )
              }
            />
            <input
              type="text"
              placeholder="Descripción"
              value={item.descripcion}
              onChange={(e) =>
                setItems(
                  items.map((item, i) =>
                    i === index ? { ...item, descripcion: e.target.value } : item
                  )
                )
              }
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={guardarDatos}>
        Guardar Datos
      </button>
      <button type="button" onClick={guardarDatosYGenerarPDF}>
        Guardar Datos y Generar PDF
      </button>
      <div style={{ display: "none" }}>
        <img id="image1" src={Papel} alt="Imagen 1" />
        <img id="image2" src={Papel2} alt="Imagen 2" />
      </div>
      <table id="miTabla">
        <thead>
          <tr>
            <th>Folio</th>
            <th>Fecha</th>
            <th>Suministro</th>
            <th>PC</th>
            <th>Proyecto</th>
            <th>Actividad</th>
            <th>Justificación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{folio}</td>
            <td>{fecha}</td>
            <td>{suministro}</td>
            <td>{pc}</td>
            <td>{SelectedProyecto}</td> {
            <td>{actividad}</td>
            <td>{justificacion}</td>
          </tr>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.cantidad}</td>
              <td>{item.unidad}</td>
              <td colSpan="5">{item.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
