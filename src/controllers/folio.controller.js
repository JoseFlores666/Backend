import FolioCounter from "../models/folioCounter.modal.js";

export const obtenerUltimoFolioCounterSoli = async (req, res) => {
  try {
    const ultimoFolioCounter = await FolioCounter.findOne().sort({
      year: -1,
      month: -1,
      counter: -1,
    });

    const now = new Date();
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    let counter;

    if (ultimoFolioCounter) {
      if (
        ultimoFolioCounter.year === currentYear &&
        ultimoFolioCounter.month === currentMonth
      ) {
        counter = ultimoFolioCounter.counter + 1;
      } else {
        counter = 1;
      }
    } else {
      counter = 1;
    }

    const folio = `${currentYear}/${currentMonth}/${counter
      .toString()
      .padStart(3, "0")}`;

    res.json({ folio });
  } catch (error) {
    console.error("Error al obtener el último folio interno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerUltimoFolioCounterInforme = async (req, res) => {
  try {
    // Buscar el último documento basado en yearInforme y counterInforme
    const ultimoFolioCounter = await FolioCounter.findOne().sort({
      yearInforme: -1,
      counterInforme: -1,
    });

    const now = new Date();
    const currentYear = now.getFullYear();

    let counter;

    if (ultimoFolioCounter) {
      // Comparar el año del último documento con el año actual
      if (ultimoFolioCounter.yearInforme === currentYear) {
        counter = ultimoFolioCounter.counterInforme + 1;
      } else {
        counter = 1; // Si el año es diferente, reiniciar el contador
      }
    } else {
      counter = 1; // Si no hay documentos, iniciar el contador en 1
    }

    const folio = `${counter.toString().padStart(3, "0")}`; // Formatear el contador con 3 dígitos

    res.json({ folio });
  } catch (error) {
    console.error("Error al obtener el último folio interno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
