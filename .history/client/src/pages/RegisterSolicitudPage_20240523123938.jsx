import React, { useRef, useState, useEffect } from "react";
import { generatePDF } from "../util/pdfUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { useParams } from "react-router-dom";
import "../css/solicitud.css";
import "../css/tablas.css";

export const RegisterSolicitudPage = () => {
  const { data: solicitudId } = useParams();

  const formRef = useRef(null);
  const [items, setItems] = useState([{ cantidad: "", unidad: "", descripcion: "" }]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProyecto, setSelectedProyecto] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [solicitud, setSolicitud] = useState(null);

  const {
    getunSolitud,
    updateSoli,
    crearmySoli,
    getIdsProyect,
    ids,
    unasoli,
    getIdsProyectYAct,
    idsAct = [],
  } = useSoli();

  const { user } = useAuth();

  useEffect(() => {
    const fetchSolicitudData = async () => {
      if (solicitudId) {
        setIsEditing(true);
        try {
          await getunSolitud(solicitudId);
          if (unasoli) {
            setSolicitud(unasoli);
            populateForm(unasoli);
          } else {
            console.error("No solicitud data found");
          }
        } catch (error) {
          console.error("Error fetching solicitud:", error);
        }
      } else {
        setIsEditing(false);
      }
    };

    fetchSolicitudData();
  }, [solicitudId, unasoli]);

  useEffect(() => {
    if (!projectsLoaded) {
      getIdsProyect()
        .then(() => {
          setProjectsLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
        });
    }
  }, [projectsLoaded, getIdsProyect]);

  const handleProyectoChange = (event) => {
    event.preventDefault();
    setSelectedProyecto(event.target.value);
    getIdsProyectYAct(event.target.value).catch((error) => {
      console.error("Error fetching activities:", error);
    });
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

    if (isEditing && solicitud) {
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
    if (!form) return;

    try {
      form.querySelector("#Folio").value = solicitud.folio || "";
      form.querySelector("#Suministro").value = solicitud.tipoSuministro || "";
      form.querySelector("#PC").value = solicitud.procesoClave || "";
      setSelectedProyecto(solicitud.proyecto || "");
      setSelectedDate(new Date(solicitud.fecha || Date.now()));
      if (solicitud.items && Array.isArray(solicitud.items)) {
        setItems(
          solicitud.items.map((item) => ({
            cantidad: item.cantidad,
            unidad: item.unidad,
            descripcion: item.descripcion,
          }))
        );
      } else {
        setItems([{ cantidad: "", unidad: "", descripcion: "" }]);
      }
      form.querySelector("#Justificacion").value = solicitud.justificacion || "";
    } catch (error) {
      console.error("Error populating form:", error);
    }
  };

  return (
    <div className="body2">
      <h2 className="labels">{isEditing ? "Actualizar Solicitud" : "Registrar Solicitud"}</h2>
      <form className="formulariodatos" onSubmit={handleSubmit} ref={formRef}>
        <div className="division">
          <label htmlFor="Folio" className="labels">
            Folio:
          </label>
          <input
            type="number"
            id="Folio"
            className="Inputs2"
            name="Folio"
            placeholder="folio"
            required
          />
          <label htmlFor="Fecha" className="labels">
            Fecha:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            name="Fecha"
            required
            className="Inputs2"
          />
        </div>
        <div className="division">
          <label className="labels">Tipo de Suministro:</label>
          <label className="labels">Proceso Clave (PC):</label>
        </div>
        <div className="division">
          <select id="Suministro" name="Suministro" className="select" required>
            <option value="">Seleccione un suministro</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
          <select id="PC" name="PC" className="select" required>
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
            id="Proyecto"
            name="Proyecto"
            className="select"
            value={selectedProyecto}
            onChange={handleProyectoChange}
            required
          >
            <option value="" disabled>
              Seleccione el Proyecto
            </option>
            {ids.map((proyecto) => (
              <option key={proyecto._id} value={proyecto._id}>
                {proyecto.nombre}
              </option>
            ))}
          </select>
          <select id="Actividad" name="Actividad" className="select" required>
            <option value="" disabled>
              Seleccione la Actividad
            </option>
            {Array.isArray(idsAct) ? (
              idsAct.map((actividad) => (
                <option key={actividad._id} value={actividad._id}>
                  {actividad.nombre}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No hay actividades disponibles
              </option>
            )}
          </select>
        </div>
        <table>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <label className="labels">Cantidad:</label>
                  <input
                    type="number"
                    className="Inputs2"
                    name={`cantidad-${index}`}
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(index, "cantidad", e.target.value)}
                    required
                  />
                </td>
                <td>
                  <label className="labels">Unidad:</label>
                  <input
                    type="text"
                    className="Inputs2"
                    name={`unidad-${index}`}
                    value={item.unidad}
                    onChange={(e) => handleItemChange(index, "unidad", e.target.value)}
                    required
                  />
                </td>
                <td>
                  <label className="labels">Descripción:</label>
                  <input
                    type="text"
                    className="Inputs2"
                    name={`descripcion-${index}`}
                    value={item.descripcion}
                    onChange={(e) => handleItemChange(index, "descripcion", e.target.value)}
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={addItem}>
          Añadir Item
        </button>
        <div className="division">
          <label className="labels">Justificación:</label>
          <textarea
            id="Justificacion"
            className="Inputs2"
            name="Justificacion"
            placeholder="Ingrese la justificación"
            required
          />
        </div>
        <div className="division">
          <label className="labels">Firmas:</label>
          <div className="firmas">
            <input
              type="text"
              id="Solicitud"
              className="Inputs2"
              name="Solicitud"
              placeholder="Solicitud"
              required
            />
            <input
              type="text"
              id="Revision"
              className="Inputs2"
              name="Revision"
              placeholder="Revisión"
              required
            />
            <input
              type="text"
              id="Validacion"
              className="Inputs2"
              name="Validacion"
              placeholder="Validación"
              required
            />
            <input
              type="text"
              id="Autorizacion"
              className="Inputs2"
              name="Autorizacion"
              placeholder="Autorización"
              required
            />
          </div>
        </div>
        <div className="botones">
          <button type="submit" className="boton">
            {isEditing ? "Actualizar Solicitud" : "Registrar Solicitud"}
          </button>
          <button type="button" onClick={handleGeneratePDF} className="boton">
            Generar PDF
          </button>
        </div>
      </form>
    </div>
  );
};
