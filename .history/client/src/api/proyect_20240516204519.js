import axios from "./axios";


export const verifyTokenRequest = async () => axios.get(`/auth/proyecto/ids`);


