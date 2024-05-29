import axios from "./axios";

export const getSolitudes = async () => axios.get("/solicitud");

export const getFiltroEstado = async (estado) => axios.get(`/solicitud/estado/${estado}`);

export const createSoli= async (soli) => axios.post(`/solicitud`, soli);

export const updateSoli = async (soli) =>axios.put(`/solicitud/${soli._id}`, soli);

export const deleteSoli = async (id) => axios.delete(`/solicitud/eliminar&${id}`);

export const getUnaSoli = async (folio) => axios.get(`/solicitud/${folio}`);


// consultas de hacia el api para la collecion "proyectos"

export const idsProyect = async () => axios.get(`/proyecto/ids`);

export const traeUnProyectAct = async (id) => axios.get(`/proyecto/${id}`);

export const getUnProyectYAct = async (proyectoId,actividadId) => axios.get(`/proyecto/${proyectoId}/actividad/${actividadId}`);
