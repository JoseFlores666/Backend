import HistorialSoli from "../models/historialSoli.model.js";

export const verHistorialSoli = async (req, res) => {
  try {
    const historialSoli = await HistorialSoli.find()
      .populate({
        path: "user",
        select: "username",
      })
      .populate({
        path: "numeroDeSolicitud",
        select: "folio",
      })
      .lean();

    if (!historialSoli) {
      return res.status(404).json({ mensaje: "historial no encontrado" });
    }

    res.json(historialSoli);
  } catch (error) {
    console.log("error al consultar la coleccion Técnicos");
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const verUnaHistorialSoli = async (req, res) => {
  try {
    const { id } = req.params;
    const historialSoli = await HistorialSoli.find({ numeroDeSolicitud: id })
      .populate({
        path: "user",
        select: "username",
      })
      .populate({
        path: "numeroDeSolicitud",
        select: "folio",
      })
      .lean();

    if (historialSoli.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "El historial del usuario no se encontró" });
    }

    historialSoli.forEach((histoSoli) => {
      if (histoSoli.numeroDeSolicitud && histoSoli.numeroDeSolicitud.folio) {
        const parts = histoSoli.numeroDeSolicitud.folio.split("/");
        histoSoli.numeroDeSolicitud.folio = parts.slice(2).join("/");
      } else {
        histoSoli.numeroDeSolicitud.folio = "Folio no disponible";
      }
    });

    res.json(historialSoli);
  } catch (error) {
    console.log("error al consultar la coleccion Técnicos");
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
