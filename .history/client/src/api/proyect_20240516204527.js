import axios from "./axios";


export const ids = async () => axios.get(`/auth/proyecto/ids`);


