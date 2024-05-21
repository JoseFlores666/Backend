import { createContext, useContext, useState } from "react";
import { getSolitudes, createSoli, deleteSoli, getUnaSoli, updateSoli,} from "../api/soli";
import { idsProyect} from "../api/soli";


const SoliContext = createContext();

//siempre importar a useSoli   <------ para usar las funciones de aqui
export const useSoli = () => {
  const context = useContext(SoliContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};


export function SoliProvider({ children }) {
  const [soli, setSoli] =  useState([]);
  

  const getSoli = async() => {
    const res = await getSolitudes();
    setSoli(res.data);
  }

  const [idsPro, setidsPro] =  useState([]);// idsPro va a guardar el id de todos los proyectos xd
  const getIdsProyect = async() => {
    const res = await idsProyect();
    setidsPro(res.data);
  }

  const crearmySoli = async (soli) =>{
    console.log(soli)
    const res = await createSoli(soli);
   console.log(res)
  }

  return (
    <SoliContext.Provider 
    value={{ soli ,getSoli,crearmySoli ,deleteSoli,idsProyect,
      getUnaSoli,idsPro,
      updateSoli,}}
    >{children}
    </SoliContext.Provider>
  );
}
