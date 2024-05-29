import { createContext, useContext, useState, useEffect } from "react";
import {
  getSolitudes,
  createSoli,
  deleteSoli,
  getUnaSoli,
  updateSoli,
  idsProyect,
  getUnProyectYAct,
  traeUnProyectAct,getFiltroEstado
} from "../api/soli";
import {
  getInfome,
  createInfome,
  updateInfome,
  deleteInfome,
  getUnaInfome,
} from "../api/informe";

const SoliContext = createContext();

export const useSoli = () => {
  const context = useContext(SoliContext);
  if (!context) throw new Error("useSoli must be used within a SoliProvider");
  return context;
};

export function SoliProvider({ children }) {
  const [soli, setSoli] = useState([]);
  const [ids, setIds] = useState([]);
  const [proyect, setproyect] = useState([]);
  const [act, setAct] = useState([]);
  const [idsAct, setIdsAct] = useState([]);
  const [nombreProAct, setNombreProAct] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [unasoli, setUnaSoli] = useState([]);
  const [unProyectAct, setUnProyectAct] = useState([]);

  //Solicitudes
  const getSoli = async () => {
    try {
      const res = await getSolitudes();
      setSoli(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };
  const getunSolitud = async (id) => {
    try {
      const res = await getUnaSoli(id);
      setUnaSoli(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };
  const getun = async (estado) => {
    try {
      const res = await getFiltroEstado(estado);
      setUnaSoli(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  const crearmySoli = async (soli) => {
    try {
      const res = await createSoli(soli);
      console.log(res);
      if (!res) {
        console.log("Error al crear la solicitud");
      } else {
        console.log("Solicitud creada con éxito");
      }
    } catch (error) {
      console.error("Error creating solicitud:", error);
      setErrors(["Error creating solicitud"]);
    }
  };


  //proyectos 
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const getIdsProyect = async () => {
    try {
      const res = await idsProyect();

      setIds(res.data); //id con todos los proyectos
    } catch (error) {
      console.error("Error fetching project ids:", error);
      setErrors(["Error fetching project ids"]);
    }
  };

  const getIdsProyectYAct = async (id) => {
    try {
      const res = await traeUnProyectAct(id);
      setIdsAct(res.data.actividades);
    } catch (error) {
      console.error("Error fetching project activities:", error);
      setErrors(["Error fetching project activities"]);
    }
  };

  const getIdsProyectYActIndividual = async (proyectoId, actividadId) => {
    try {
      const res = await getUnProyectYAct(proyectoId, actividadId);
      setproyect(res.data.nombreProyecto);
      setAct(res.data.nombreActividad);
    } catch (error) {
      console.error("Error fetching project activities:", error);
      setErrors(["Error fetching project activities"]);
    }
  };

  // Informe
  const getInfo = async () => {
    try {
      const res = await getInfome();
      setInfo(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  const createInfo = async (info) => {
    try {
      const res = await createInfome(info);
      if (!res) {
        console.log("Error al crear la solicitud");
      } else {
        console.log("Solicitud creada con éxito");
      }
    } catch (error) {
      console.error("Error creating solicitud:", error);
      setErrors(["Error creating solicitud"]);
    }
  };

  return (
    <SoliContext.Provider
      value={{
        soli,
        unasoli,
        act,
        getSoli,
        unProyectAct,
        getunSolitud,
        proyect,
        ids,
        getIdsProyectYActIndividual,
        getIdsProyect,
        nombreProAct,
        idsAct,
        getIdsProyectYAct,
        crearmySoli,
        deleteSoli,
        getUnaSoli,
        updateSoli,
        info,
        getInfo,
        createInfo,
        errors,
        loading,
      }}
    >
      {children}
    </SoliContext.Provider>
  );
}
