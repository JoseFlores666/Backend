import axios from "./axios";

export const getSoli = async () => axios.get("/tasks");

export const createSoli= async (task) => axios.post("/tasks", task);

export const updateSoli = async (task) =>
  axios.put(`/tasks/${task._id}`, task);

export const deleteSoli = async (id) => axios.delete(`/tasks/${id}`);

export const getUnaSOli = async (id) => axios.get(`/tasks/${id}`);
