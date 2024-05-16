import { createContext, useContext, useState } from "react";
import {
  getSoli,
  createSoli,
  deleteSoli,
  getUnaSoli,
  updateSoli,
} from "../api/soli";
const SoliContext = createContext();

export const useSoli = () => {
  const context = useContext(SoliContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};
export function SoliProvider({ children }) {
  const [soli, setSoli] =  useState([]);

  const crearSoli = async (soli) =>{
    const res = await 
  }

  return (
    <SoliContext.Provider 
    value={{ soli }}
    >{children}
    </SoliContext.Provider>
  );
}
