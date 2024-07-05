//Esta es mi axios personalizada
import axios from "./axios";

export const getDescarga = async () => {
  try {
    // Realiza la solicitud GET usando la instancia personalizada de Axios
    const response = await axios.get(`/descargar/`);
    return response.data; // Devuelve los datos obtenidos en la respuesta
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
    throw error; // Lanza el error para manejarlo en el lugar donde se llame a esta función
  }
};
export const getDescarga = async () => {
  try {
    // Realiza la solicitud GET usando la instancia personalizada de Axios
    const response = await axios.get(`/descargar/`);
    return response.data; // Devuelve los datos obtenidos en la respuesta
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
    throw error; // Lanza el error para manejarlo en el lugar donde se llame a esta función
  }
};
