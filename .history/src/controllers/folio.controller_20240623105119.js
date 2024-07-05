import FolioCounter from "../models/folioCounter.modal.js";

export const obtenerUltimoFolioCounterSoli = async (req, res) => {
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

export const obtenerUltimoFolioCounterInforme = async (req, res) => {
  try {
    // Buscar el último FolioCounter ordenado por yearInforme, monthInforme y counterInforme
    const ultimoFolioCounter = await FolioCounter.findOne().sort({ yearInforme: -1, monthInforme: -1, counterInforme: -1 });

    // Obtener la fecha actual
    const now = new Date();
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    let counterInforme;

    // Si existe un último FolioCounter y pertenece al mismo mes y año, incrementar el counterInforme
    if (ultimoFolioCounter) {
      if (ultimoFolioCounter.yearInforme === currentYear && ultimoFolioCounter.monthInforme === currentMonth) {
        counterInforme = ultimoFolioCounter.counterInforme + 1;
      } else {
        counterInforme = 1;
      }
    } else {
      counterInforme = 1;
    }

    // Generar el nuevo folio para informes
    const folioInforme = `${currentYear}/${currentMonth}/${counterInforme.toString().padStart(3, '0')}`;

    // Enviar la respuesta con el nuevo folio
    res.json({ folioInforme });
  } catch (error) {
    console.error("Error al obtener el último folio de informe:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};