import { createContext, useContext, useState, useEffect } from "react";

 import {createInfome,deleteInfome,getInfome,getUnaInfome,updateInfome} from '../api/informe'

const InfomeContext = createContext();

export const useInfo = () => {
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
        getMysInfome,
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