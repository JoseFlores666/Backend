import Solicitud from "../models/solicitud.modal.js";

export const abonarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { folioExterno, items } = req.body;

    const solicitudExistente = await Solicitud.findById(id);
    if (!solicitudExistente) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    solicitudExistente.folioExterno = folioExterno;

    // Itera sobre los items y actualiza cantidadAcumulada y cantidadEntregada en suministros
    items.forEach((item) => {
      const suministro = solicitudExistente.suministros.find(
        (s) => s._id === item._id
      );
      if (suministro) {
        suministro.cantidadAcumulada = item.cantidadAcumulada;
        suministro.cantidadEntregada = item.cantidadEntregada;
      }
    });

    // Guarda la solicitud actualizada
    await solicitudExistente.save();

    res.json(solicitudExistente);
    console.log("Solicitud actualizada exitosamente");
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
