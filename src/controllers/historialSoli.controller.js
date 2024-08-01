import HistorialSoli from "../models/historialSoli.model.js";

export const verHistorialSoli = async (req, res) => {
  try {
    const historialSoli = await HistorialSoli.find();
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
    const historialesSoli = await HistorialSoli.find({ numeroDeSolicitud: id });

    if (historialesSoli.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "El historial del usuario no se encontró" });
    }
    res.json(historialesSoli);
  } catch (error) {
    console.log("error al consultar la coleccion Técnicos");
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
