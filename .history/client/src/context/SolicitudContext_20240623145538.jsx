import { createContext, useContext, useState, useEffect } from "react";
import {
  getSolitudes,
  createSoli,
  deleteSoli,
  getUnaSoli,
  updateSoli,
  idsProyect,
  getUnProyectYAct,
  traeUnProyectAct,
  getFiltroEstado,
  nombreFirmas, editarNombreFirmas, putAbono
} from "../api/soli";
import { getInfome, createInfome } from "../api/informe";
import { getfolioInterno, getfolioInternoInforme } from "../api/folio";

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
  const [nombresFirmas, setNombresFirmas] = useState([]);
  const [myFolioInterno, setMyFolioInterno] = useState([]);
  const [myFolioInternoInfo, setMyFolioInternoInfo] = useState([]);


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
      // console.log(res.data);
      setUnaSoli(res.data);
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  const deleteSolitud = async (id) => {
    try {
      const res = await deleteSoli(id);

    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };

  const getUnPorEstado = async (estado) => {
    try {
      const res = await getFiltroEstado(estado);
      setSoli(res.data);
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

  const actializarSoli = async (id, datosSolicitud) => {
    try {
      await updateSoli(id, datosSolicitud);
      console.log("Actulizado con exito");
    } catch (error) {
      console.error("Error fetching solitudes:", error);
      setErrors(["Error fetching solitudes"]);
    }
  };
  //abono
  const RealizarAbono = async (id, data) => {
    try {
      await putAbono(id, data);
      console.log("Abonado con exito");
    } catch (error) {
      console.error("Error al abonar:", error);
      setErrors(["Error al abonar solitudes"]);
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

  //obtener nombre del proyecto y actividad
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

  //firmas
  const getFirmas = async () => {
    try {
      const res = await nombreFirmas();
      setNombresFirmas(res.data);
    } catch (error) {
      console.error("Error fetching firmas:", error);
      setErrors(["Error fetching firnas"]);
    }
  };
  const editarFirmas = async (nombrefirmas) => {
    try {

      const id = "664d5e645db2ce15d4468548";
      await editarNombreFirmas(id, nombrefirmas);

      console.log("Actulizado con exito");
    } catch (error) {
      console.error("Error :", error);
      setErrors(["Error fetching firmas"]);
    }
  };
  //Folio
  const traeFolioInterno = async () => {
    try {
      const res = await getfolioInterno();

      setMyFolioInterno(res.data.folio);
    } catch (error) {
      console.error("Error fetching firmas:", error);
      setErrors(["Error fetching firnas"]);
    }
  };
  const traeFolioInternoInforme = async () => {
    try {
      const res = await getfolioInternoInforme();
      // console.log(res.data.folioInforme)
      setMyFolioInternoInfo(res.data.folioInforme);
    } catch (error) {
      console.error("Error fetching firmas:", error);
      setErrors(["Error fetching firnas"]);
    }
  };

  const getDescargaLocal = async () => {
    const response = await fetch('http://localhost:4000/api/descargar/');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'result.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const getDescargaExterna = async () => {
    const response = await fetch('http://localhost:4000/api/descargar/externo');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'result.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <SoliContext.Provider
      value={{
        soli,
        getDescargaLocal,
        getDescargaExterna,
        editarFirmas,
        myFolioInterno,
        traeFolioInternoInforme, myFolioInternoInfo,
        nombresFirmas,
        traeFolioInterno,
        unasoli,
        RealizarAbono,
        getFirmas,
        actializarSoli,
        act,
        getUnPorEstado,
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
        deleteSolitud,
        getUnaSoli,
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
