import { createContext, useContext, useState } from "react";
import {
  getSoli,
  createSoli,
  deleteSoli,
  getUnaSoli,
  updateSoli,
} from "../api/soli";


const SoliContext = createContext();

//siempre importar a useSoli   <------ para usar las funciones de aqui
export const useSoli = () => {
  const context = useContext(SoliContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};


export function SoliProvider({ children }) {
  const [soli, setSoli] =  useState([]);

  const crearmySoli = async (soli) =>{
    console.log(soli)
    const res = await createSoli(soli);
   console.log(res)
  }

  return (
    <SoliContext.Provider 
    value={{ soli ,crearmySoli ,deleteSoli,
      getUnaSoli,
      updateSoli,}}
    >{children}
    </SoliContext.Provider>
  );
}
