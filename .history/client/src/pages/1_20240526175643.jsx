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
  const [proyectos, setProyectos] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);
  const { crearmySoli, getIdsProyectYAct, getIdsProyect, ids, idsAct = [] } =
    useSoli();
  const { user } = useAuth();
  const id = user.id;

  // Función para manejar el cambio de proyecto
  const handleProyectoChange = (value) => {
    setProyecto(value);
    setActividad("");
    setActivitiesLoaded(false);
  };

  // Resto del código...

  return (
    <div className="body2">
      <div className="formulariodatos" id="formRef">
        {/* Aquí se encuentra el select para seleccionar el proyecto */}
        <div className="division">
          <label className="labels">Proyecto:</label>
          <select
            id="Proyecto"
            value={proyecto}
            onChange={(e) => handleProyectoChange(e.target.value)} {/* Aquí se utiliza la función handleProyectoChange */}
          >
            <option value="">Seleccione el Proyecto</option>
            {ids.map((ids) => (
              <option key={ids.id} value={ids.id}>
                {ids.nombre}
              </option>
            ))}
          </select>
        </div>
        {/* Resto del componente */}
      </div>
    </div>
  );
};
