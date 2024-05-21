import { createContext, useContext, useState } from "react";
import {
  getSolitudes,
  createSoli,
  deleteSoli,
  getUnaSoli,
  updateSoli,
} from "../api/soli";
import { idsProyect } from "../api/soli";

const SoliContext = createContext();

//siempre importar a useSoli   <------ para usar las funciones de aqui
export const useSoli = () => {
  const context = useContext(SoliContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

export function SoliProvider({ children }) {
  const [soli, setSoli] = useState([]);
  const [ids, setIds] = useState([]);// este trae los id de los proyectos
  const [idsAct, setIdsAct] = useState([]);

  const getSoli = async () => {
    const res = await getSolitudes();
    setSoli(res.data);
  };

  const getIdsProyect = async () => {
    const res = await idsProyect();
    setIds(res.data);
  };
  const getIdsAct= async (.data) => {
    const res = await idsActividades();
    setIdsAct(res.data);
  };

  const crearmySoli = async (soli) => {
    console.log(soli);
    const res = await createSoli(soli);
    if (!res) {
      console.log("Error al iniciar sesión verifique su usuario o contraseña");
    } else {
      console.log("Inicio de sesión exisota");
    }
  };

  return (
    <SoliContext.Provider
      value={{
        soli,
        getSoli,
        ids,
        crearmySoli,
        deleteSoli,
        getIdsProyect,getIdsAct,idsAct,
        getUnaSoli,
        updateSoli,
      }}
    >
      {children}
    </SoliContext.Provider>
  );
}
