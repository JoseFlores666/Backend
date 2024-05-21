import { createContext, useContext, useState, useEffect } from "react";

 import {createInfome,deleteInfome,getInfome,getUnaInfome,updateInfome} from '../api/informe'

const InfomeContext = createContext();

export const useInfo = () => {
  const context = useContext(InfomeContext);
  if (!context) throw new Error("useSoli must be used within a InfomeContext");
  return context;
};

export function SoliProvider({ children }) {
  const [errors, setErrors] = useState([]);

 
 
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
    <InfomeContext.Provider
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
    </InfomeContext.Provider>
  );
}