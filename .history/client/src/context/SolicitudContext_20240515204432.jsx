import { createContext, useContext, useState } from "react";
import {
  getSoli,
  createSoli,
  deleteSoli,
  getUnaSoli,
  updateSoli,
} from "../api/soli";


const SoliContext = createContext();

//siempre importar

export const useSoli = () => {
  const context = useContext(SoliContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};
export function SoliProvider({ children }) {
  const [soli, setSoli] =  useState([]);

  const crearmySoli = async (soli) =>{
    
    const res = await createSoli(soli);
    console.log(res)
  }

  return (
    <SoliContext.Provider 
    value={{ soli ,crearmySoli}}
    >{children}
    </SoliContext.Provider>
  );
}
