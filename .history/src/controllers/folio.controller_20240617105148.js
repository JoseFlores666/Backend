import FolioCounter from "../models/folioCounter.modal.js";
import Solicitud from "../models/solicitud.modal.js";

export const obtenerUltimoFolioCounter = async (req, res) => {
  try {
    const ultimoFolioCounter = await FolioCounter.findOne().sort({ year: -1, month: -1, counter: -1 });

    const now = new Date();
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    let counter;

    if (ultimoFolioCounter) {
      if (ultimoFolioCounter.year === currentYear && ultimoFolioCounter.month === currentMonth) {
        counter = ultimoFolioCounter.counter + 1;
      } else {
        counter = 1;
      }
    } else {
      counter = 1;
    }

    const folio = `${currentYear}/${currentMonth}/${counter.toString().padStart(3, '0')}`;

    res.json({ folio });
  } catch (error) {
    console.error("Error al obtener el último folio interno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};