//Esta es mi axios personalizada
import axios from "./axios";

export const getDescarga = async () => axios.get(`/folio/ultimo-folio-counter`);
