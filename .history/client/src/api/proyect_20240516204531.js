import axios from "./axios";


export const idsProyect = async () => axios.get(`/auth/proyecto/ids`);


