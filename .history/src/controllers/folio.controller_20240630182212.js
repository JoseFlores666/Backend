import FolioCounter from "../models/folioCounter.modal.js";

export const obtenerUltimoFolioCounterSoli = async (req, res) => {
  try {
    const ultimoFolioCounter = await FolioCounter.findOne().sort({
      counterInforme: -1,
    });

    let counterInforme;

    if (ultimoFolioCounter) {
      counterInforme = ultimoFolioCounter.counterInforme + 1;
    } else {
      counterInforme = 1;
    }

    res.json({ counterInforme });
  } catch (error) {
    console.error("Error al obtener el último folio de informe:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerUltimoFolioCounterInforme = async (req, res) => {
  try {
    const ultimoFolioCounter = await FolioCounter.findOne({}).sort({
      counterInforme: -1,
    });

    let counterInforme;

    if (ultimoFolioCounter) {
      counterInforme = ultimoFolioCounter.counterInforme + 1;
    } else {
      counterInforme = 1;
    }
    const folioInforme = `${counterInforme.toString().padStart(4, "0")}`;

    // Enviar la respuesta con el nuevo folio
    res.json({ folioInforme });
  } catch (error) {
    console.error("Error al obtener el último folio de informe:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
