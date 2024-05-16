import axios from "./axios";

export const getSoli = async () => axios.get("/solicitud");

export const createSoli= async (soli) => axios.post("/solicitud", soli);

export const updateSoli = async (soli) =>axios.put(`/tasks/${task._id}`, task);

export const deleteSoli = async (id) => axios.delete(`/solicitud/${id}`);

export const getUnaSoli = async (id) => axios.get(`/solicitud/${id}`);
