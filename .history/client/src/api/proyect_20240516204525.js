import axios from "./axios";


export const id = async () => axios.get(`/auth/proyecto/ids`);


