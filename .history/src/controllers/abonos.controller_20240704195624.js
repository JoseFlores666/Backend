import Solicitud from "../models/solicitud.modal.js";

export const abonarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { folioExterno, items, arrayID } = req.body;

    console.log("Items recibidos:", req.body);

    // Encontrar la solicitud existente
    const solicitudExistente = await Solicitud.findById(id);
    if (!solicitudExistente) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    // Actualizar folio externo si no existe
    const existeFolioExterno = await Solicitud.exists({ folioExterno });
    if (!existeFolioExterno) {
      solicitudExistente.folioExterno = folioExterno;
    }

    // Asegúrate de que arrayID y items tienen la misma longitud
    if (arrayID.length !== items.length) {
      return res.status(400).json({
        error: "La longitud de arrayID y items debe ser la misma.",
      });
    }

    // Actualizar los suministros
    for (let i = 0; i < arrayID.length; i++) {
      const suministroID = arrayID[i];
      const item = items[i];


      const suministro = solicitudExistente.suministros.find(
        (s) => s._id.toString() === suministroID
      );

      if (suministro) {
        if (!suministro.cantidadAcumulada) {
          suministro.cantidadAcumulada = 0;
        }

        const nuevaCantidadAcumulada =
          suministro.cantidadAcumulada + parseInt(item.cantidadEntregada);

        if (nuevaCantidadAcumulada <= suministro.cantidad) {
          suministro.cantidadAcumulada = nuevaCantidadAcumulada;
          suministro.cantidadEntregada = 0;
          suministro.NumeroDeEntregas += 1;
        } else {
          return res.status(400).json({
            error: `La cantidad acumulada no puede exceder la cantidad requerida para el suministro ${suministroID}.`,
          });
        }
      } else {
        return res.status(404).json({
          error: `Suministro ${suministroID} no encontrado en la solicitud.`,
        });
      }
    }
 let allItemsCompleted = true;
 if (allItemsCompleted) {
  solicitudExistente.estado = "Atendida";
}
    // Guardar la solicitud actualizada
    await solicitudExistente.save();
    console.log("Solicitud actualizada exitosamente");
    return res.json({
      mensaje: "El abono realizado exitosamente",
      solicitud: solicitudExistente,
    });
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    return res.status(500).json({ error: error.message });
  }
};
