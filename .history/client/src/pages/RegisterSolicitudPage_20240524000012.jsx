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
  const [selectedActividad, setSelectedActividad] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [solicitud, setSolicitud] = useState(null);
  const [queryExecuted, setQueryExecuted] = useState(false);

  const { getunSolitud, updateSoli, crearmySoli, getIdsProyect, ids, unasoli, getIdsProyectYAct, idsAct = [] } = useSoli();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSolicitudData = async () => {
      if (!queryExecuted && solicitudId) {
       
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
     setIsEditing(true);
    fetchSolicitudData();
    setQueryExecuted(true); 
  }, [solicitudId, getunSolitud, unasoli]);

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

  useEffect(() => {
    if (selectedProyecto) {
      getIdsProyectYAct(selectedProyecto).catch((error) => {
        console.error("Error fetching activities:", error);
      });
    }
  }, [selectedProyecto, getIdsProyectYAct]);

  const handleProyectoChange = (event) => {
    event.preventDefault();
    setSelectedProyecto(event.target.value);
    setSelectedActividad(""); // Clear actividad selection when proyecto changes
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
      form.querySelector("#Suministro").value = solicitud.suministro || "";
      form.querySelector("#PC").value = solicitud.pc || "";
      setSelectedProyecto(solicitud.proyecto || "");
      setSelectedDate(new Date(solicitud.fecha || Date.now()));
      setSelectedActividad(solicitud.actividad || "");

      // Verificar que solicitud.items sea un arreglo antes de usar map
      if (Array.isArray(solicitud.items)) {
        setItems(
          solicitud.items.map((item) => ({
            cantidad: item.cantidad,
            unidad: item.unidad,
            descripcion: item.descripcion,
          }))
        );
      } else {
        setItems([]); // O alguna lógica por defecto
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
          <select
            id="Actividad"
            name="Actividad"
            className="select"
            value={selectedActividad}
            onChange={(e) => setSelectedActividad(e.target.value)}
            required
          >
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
                    placeholder="Ingresa la cantidad"
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(index, "cantidad", e.target.value)}
                    name={`Cantidad_${index}`}
                    required
                  />
                </td>
                <td>
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
                </td>
                <td>
                  <label className="labels">Descripcion del bien solicitado:</label>
                  <textarea
                    className="inputs3"
                    placeholder="Ingresa su descripción"
                    value={item.descripcion}
                    onChange={(e) => handleItemChange(index, "descripcion", e.target.value)}
                    name={`Descripcion_${index}`}
                    required
                  ></textarea>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addItem}
          className="btn-agregarfila btn-primary shadow-lg shadow-indigo-500/40"
        >
          Agregar otra fila
        </button>
        <div className="division">
          <label className="labels">Justificacion para la adquisición:</label>
        </div>
        <textarea
          className="inputs4"
          id="Justificacion"
          name="Justificacion"
          placeholder="Ingrese la justificación de la solicitud"
          required
        ></textarea>
        <div className="botones">
          <button type="submit" className="btn-primary">
            {isEditing ? "Guardar cambios" : "Registrar"}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleGeneratePDF}
          >
            Generar PDF
          </button>
        </div>
      </form>
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
          <tr>
            <td id="td-proyecto" rowSpan="5">Proyecto: <br />{datos.proyecto}</td>
            <td></td>
            <td>{datos.items[0]?.cantidad}</td>

            <td></td>
            <td>{datos.items[0]?.unidad}</td>

            <td>{datos.items[0]?.descripcion}</td>

          </tr>
          <tr>
            <td></td>
            <td>{datos.items[1]?.cantidad}</td>

            <td></td>
            <td>{datos.items[1]?.unidad}</td>

            <td>{datos.items[1]?.descripcion}</td>

          </tr>
          <tr>
            <td></td>
            <td>{datos.items[2]?.cantidad}</td>

            <td></td>
            <td>{datos.items[2]?.unidad}</td>

            <td>{datos.items[2]?.descripcion}</td>

          </tr>
          <tr>
            <td></td>
            <td>{datos.items[3]?.cantidad}</td>

            <td></td>
            <td>{datos.items[3]?.unidad}</td>

            <td>{datos.items[3]?.descripcion}</td>

          </tr>
          <tr>
            <td></td>
            <td>{datos.items[4]?.cantidad}</td>

            <td></td>
            <td>{datos.items[4]?.unidad}</td>

            <td>{datos.items[4]?.descripcion}</td>

          </tr>
          <tr>
            <td id="td-actividad" rowSpan="5">Actividad: <br /> {datos.actividad}</td>
            <td></td>
            <td>{datos.items[5]?.cantidad}</td>

            <td></td>
            <td>{datos.items[5]?.unidad}</td>

            <td>{datos.items[5]?.descripcion}</td>

          </tr>
          <tr>
            <td></td>
            <td>{datos.items[6]?.cantidad}</td>

            <td></td>
            <td>{datos.items[6]?.unidad}</td>

            <td>{datos.items[6]?.descripcion}</td>

          </tr>
          <tr>
            <td></td>
            <td>{datos.items[7]?.cantidad}</td>

            <td></td>
            <td>{datos.items[7]?.unidad}</td>

            <td>{datos.items[7]?.descripcion}</td>

          </tr>
          <tr>
            <td></td>
            <td>{datos.items[8]?.cantidad}</td>

            <td></td>
            <td>{datos.items[8]?.unidad}</td>

            <td>{datos.items[8]?.descripcion}</td>

          </tr>
          <tr>
            <td></td>
            <td>{datos.items[9]?.cantidad}</td>

            <td></td>
            <td>{datos.items[9]?.unidad}</td>

            <td>{datos.items[9]?.descripcion}</td>

          </tr>
          <tr>
            <td rowSpan="">JUSTIFICACION PARA LA ADQUISICION:</td>
            <td id="td-justificacion" colSpan="6">{datos.justificacion}</td>
          </tr>
        </tbody>
      </table>
      <img src={Papel2} id='image2' alt="Papel2" style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};
