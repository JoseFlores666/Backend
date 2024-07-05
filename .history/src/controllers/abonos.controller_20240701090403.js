import Solicitud from "../models/solicitud.modal.js";

export const abonarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { folioExterno, items } = req.body;

    console.log("Items recibidos:", items);

    const solicitudExistente = await Solicitud.findById(id);
    if (!solicitudExistente) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    const existeFolioExterno = await Solicitud.exists({ folioExterno });
    if (!existeFolioExterno) {
      solicitudExistente.folioExterno = folioExterno;
    }

    for (const item of items) {
      const suministro = solicitudExistente.suministros.find(
        (s) => s._id.toString() === item._id
      );

      if (suministro) {
        const nuevaCantidadAcumulada =
          suministro.cantidadAcumulada + parseInt(item.cantidadEntregada);

        if (nuevaCantidadAcumulada < suministro.cantidad) {
          suministro.cantidadAcumulada = nuevaCantidadAcumulada;
          suministro.cantidadEntregada = 0;
          suministro.NumeroDeEntregas += 1;
        }
      } else {
        return res.status(404).json({
          error: `Suministro ${item._id} no encontrado en la solicitud.`,
        });
      }
    }

    await solicitudExistente.save();
    console.log("Solicitud actualizada exitosamente");
    return res.json({
      mensaje: "EAbono realizado exitosamente",
      solicitud: solicitudExistente,
    });
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    return res.status(500).json({ error: error.message });
  }
};
