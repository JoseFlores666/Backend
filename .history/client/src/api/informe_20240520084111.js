import axios from "./axios";

export const getInfome = async () => axios.get("/solicitud");

export const createInfome= async (info) => axios.post(`/solicitud`, info);

export const updateInfome = async (info) =>axios.put(`/solicitud/${soli._id}`, soli);

export const deleteInfome = async (id) => axios.delete(`/solicitud/${id}`);

export const getUnaInfome = async (id) => axios.get(`/solicitud/${id}`);

