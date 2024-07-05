import Solicitud from "../models/solicitud.modal.js";

export const abonarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { folioExterno, items } = req.body;
console.log(re)
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
        const nuevaCantidadAcumulada = suministro.cantidadAcumulada + item.cantidadEntregada;

        if (nuevaCantidadAcumulada > suministro.cantidad) {
          return res.status(400).json({
            error: `La cantidad acumulada para el suministro ${item._id} excede la cantidad permitida.`,
          });
        } else {
          suministro.cantidadAcumulada = nuevaCantidadAcumulada;
          suministro.cantidadEntregada = 0;
          suministro.NumeroDeEntregas += 1;
        }
      }
    }

    await solicitudExistente.save();
    res.json(solicitudExistente);
    console.log("Solicitud actualizada exitosamente");
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    res.status(500).json({ error: error.message });
  }
};