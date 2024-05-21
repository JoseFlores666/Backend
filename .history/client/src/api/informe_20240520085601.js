import axios from "./axios";

export const getInfome = async () => axios.get("/informe");

export const createInfome= async (info) => axios.post(`/informe`, info);

export const updateInfome = async (info) =>axios.put(`/informe/${info._id}`, info);

export const deleteInfome = async (id) => axios.delete(`/solicitud/${id}`);

export const getUnaInfome = async (id) => axios.get(`/solicitud/${id}`);

