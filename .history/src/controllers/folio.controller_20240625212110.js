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
  
    const ultimoFolioCounter = await FolioCounter.findOne({
    }).sort({ counterInforme: -1 });

    let counterInforme;

    // Si existe un último FolioCounter para este mes y año, incrementar el counterInforme
    if (ultimoFolioCounter) {
      counterInforme = ultimoFolioCounter.counterInforme + 1;
    } else {
      counterInforme = 1;
    }

    // Generar el nuevo folio para informes
    const folioInforme = `${counterInforme
      .toString()
      .padStart(4, "0")}`;

    // Enviar la respuesta con el nuevo folio
    res.json({ folioInforme });
  } catch (error) {
    console.error("Error al obtener el último folio de informe:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
