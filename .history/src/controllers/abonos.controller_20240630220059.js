import Solicitud from "../models/solicitud.modal.js";

export const abonarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      folioExterno,
      items ,
    } = req.body;

    console.log(items);

    const solicitudExistente = await Solicitud.findById(id);
    if (!solicitudExistente) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    const existeFolioExterno = await Solicitud.exists({ folioExterno });

    if (!existeFolioExterno) {
      solicitudExistente.folioExterno = folioExterno;
    }

    items.forEach((item) => {
      const suministro = solicitudExistente.suministros.find(
        (s) => s._id.toString() === item._id
      );
      if (suministro) {
        suministro.cantidadAcumulada = item.cantidadAcumulada;
        suministro.cantidadEntregada = item.cantidadEntregada;
      }
    });

    await solicitudExistente.save();

    res.json(solicitudExistente);
    console.log("Solicitud actualizada exitosamente");
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
