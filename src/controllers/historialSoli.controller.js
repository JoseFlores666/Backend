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

    if (historialSoli) {
      historialSoli.forEach((histoSoli) => {
        if (histoSoli.numeroDeSolicitud && histoSoli.numeroDeSolicitud.folio) {
          const parts = histoSoli.numeroDeSolicitud.folio.split("/");
          if (parts.length > 2) {
            histoSoli.numeroDeSolicitud.folio = parts.slice(2).join("/");
          }
        }
      });
    }

    res.json(historialSoli);
  } catch (error) {
    console.log("error al consultar la coleccion Técnicos");
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarUnHistorialSoli = async (req, res) => {
  try {
    const { id } = req.params;
    const { idHistorial, user } = req.body;

    const histoSoli = await HistorialSoli.findOne({ numeroDeSolicitud: id });

    if (!histoSoli) {
      return res
        .status(404)
        .json({ mensaje: "El historial del usuario no se encontró" });
    }

    const historial = new HistorialSoli({
      user: user.id,
      fecha: new Date(),
      hora: new Date().toLocaleTimeString(),
      numeroDeSolicitud: histoSoli._id,
      folio: histoSoli.folio,
      numeroDeEntrega: histoSoli.numeroDeEntrega || "",
      descripcion: `El usuario ${user.username} Elimino la solicitud:`,
      accion: "Eliminación de la solicitud",
    });

    await historial.save();

    await HistorialSoli.findByIdAndDelete(idHistorial);

    res.status(204).send();
  } catch (error) {
    console.log("error interno del servidor");
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
