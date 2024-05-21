import axios from "./axios";

export const getSolitudes = async () => axios.get("/solicitud");

export const createSoli= async (soli) => axios.post(`/solicitud`, soli);

export const updateSoli = async (soli) =>axios.put(`/solicitud/${soli._id}`, soli);

export const deleteSoli = async (id) => axios.delete(`/solicitud/${id}`);

export const getUnaSoli = async (id) => axios.get(`/solicitud/${id}`);


// consultas de hacia el api para la collecion "proyectos"

export const idsProyect = async () => axios.get(`/proyecto/ids`);

export const getProyectosYActividades = async (_id) => axios.get(`/proyecto/:_id${_id}`);