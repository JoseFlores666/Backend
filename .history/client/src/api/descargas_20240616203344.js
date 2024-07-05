//Esta es mi axios personalizada
import axios from "./axios";

export const getfolioInterno = async () => axios.get(`/folio/ultimo-folio-counter`);
