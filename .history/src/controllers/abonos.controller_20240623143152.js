import Solicitud from "../models/solicitud.modal.js";

export const abonarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const {
        folioExterno,items
    } = req.body;

    // Busca la solicitud existente por su ID
    const solicitudExistente = await Solicitud.findById(id);
    if (!solicitudExistente) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    solicitudExistente.suministros.cantidadAcumulada = items.;
    solicitudExistente.suministros.cantidadEntregada = pc;

    await solicitudExistente.save();

    res.json(solicitudExistente);
    console.log("Solicitud actualizada exitosamente");
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
