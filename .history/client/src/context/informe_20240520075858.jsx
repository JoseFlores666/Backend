import { createContext, useContext, useState, useEffect } from "react";
import {
  getInfome,
  createInfome,
  deleteInfome,
  getUnaInfome,
  updateInfome,
  idsProyect,
  traeUnProyectAct
} from "../api/soli";

const InfomeContext = createContext();

export const useSoli = () => {
  const context = useContext(InfomeContext);
  if (!context) throw new Error("useSoli must be used within a SoliProvider");
  return context;
};

export function SoliProvider({ children }) {
  const [infome, setInfome] = useState([]);
  const [ids, setIds] = useState([]);
  const [idsAct, setIdsAct] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const getysInfome = async () => {
    try {
      const res = await getInfome();
      setInfome(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  const getIdsProyect = async () => {
    try {
      const res = await idsProyect();
      setIds(res.data);
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

  const crearmyInfome = async (infome) => {
    try {
      const res = await createInfome(infome);
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
        infome,
        getInfome,
        ids,
        getIdsProyect,
        idsAct,
        getIdsProyectYAct,
        crearmyInfome,
        deleteInfome,
        getUnaInfome,
        updateInfome,
        errors,
        loading,
      }}
    >
      {children}
    </SoliContext.Provider>
  );
}