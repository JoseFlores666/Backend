import { createContext, useContext, useState } from "react";
import {
  getSolitudes,
  createSoli,
  deleteSoli,
  getUnaSoli,
  updateSoli,
  idsProyect,
  traeUnProyectAct
} from "../api/soli";

const SoliContext = createContext();

export const useSoli = () => {
  const context = useContext(SoliContext);
  if (!context) throw new Error("useSoli must be used within a SoliProvider");
  return context;
};

export function SoliProvider({ children }) {
  const [soli, setSoli] = useState([]);
  const [ids, setIds] = useState([]);
  const [idsAct, setIdsAct] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSoli = async () => {
    const res = await getSolitudes();
    setSoli(res.data);
  };

  const getIdsProyect = async () => {
    const res = await idsProyect();
    setIds(res.data);
  };

  const getIdsProyectYAct = async (id) => {
    const res = await traeUnProyectAct(id);
    setIdsAct(res.data.actividades);
  };

  const crearmySoli = async (soli) => {
    const res = await createSoli(soli);
    if (!res) {
      console.log("Error al crear la solicitud");
    } else {
      console.log("Solicitud creada con éxito");
    }
  };

  return (
    <SoliContext.Provider
      value={{
        soli,
        getSoli,
        ids,
        getIdsProyect,
        idsAct,
        getIdsProyectYAct,
        crearmySoli,
        deleteSoli,
        getUnaSoli,
        updateSoli,
      }}
    >
      {children}
    </SoliContext.Provider>
  );
}
