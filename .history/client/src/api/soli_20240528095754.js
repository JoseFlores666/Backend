import axios from "./axios";

export const getSolitudes = async () => axios.get("/solicitud");

export const getSolitudes = async () => axios.get("/solicitud");

export const createSoli= async (soli) => axios.post(`/solicitud`, soli);

export const updateSoli = async (soli) =>axios.put(`/solicitud/${soli._id}`, soli);

export const deleteSoli = async (id) => axios.delete(`/solicitud/${id}`);

export const getUnaSoli = async (id) => axios.get(`/solicitud/${id}`);


// consultas de hacia el api para la collecion "proyectos"

export const idsProyect = async () => axios.get(`/proyecto/ids`);

export const traeUnProyectAct = async (id) => axios.get(`/proyecto/${id}`);

export const getUnProyectYAct = async (proyectoId,actividadId) => axios.get(`/proyecto/${proyectoId}/actividad/${actividadId}`);
// http://localhost:4000/api/proyecto/6646c3f683956d5feeaf13c9/actividad/6646c25ed32fa54fcf15d22e