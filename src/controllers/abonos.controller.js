import Solicitud from "../models/solicitud.modal.js";

export const abonarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    console.log("Items recibidos:", req.body);

    // Encontrar la solicitud existente
    const solicitudExistente = await Solicitud.findById(id);
    if (!solicitudExistente) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    // Validar que la longitud de los items coincide con la de los suministros
    if (items.length !== solicitudExistente.suministros.length) {
      return res.status(400).json({
        error:
          "La longitud de items debe ser la misma que la de los suministros en la solicitud.",
      });
    }

    let abonoRealizado = false;
    let allItemsCompleted = true;

    // Actualizar los suministros
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const suministro = solicitudExistente.suministros[i];

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

          if (suministro.NumeroDeEntregas > 0) {
            abonoRealizado = true;
          }

          if (suministro.cantidadAcumulada < suministro.cantidad) {
            allItemsCompleted = false;
          }
        } else {
          return res.status(400).json({
            error: `La cantidad acumulada no puede exceder la cantidad requerida para el suministro ${suministro._id}.`,
          });
        }
      } else {
        return res.status(404).json({
          error: `Suministro ${suministro._id} no encontrado en la solicitud.`,
        });
      }
    }

    // Cambiar estado si es necesario
    if (abonoRealizado && solicitudExistente.estado === "Pendiente") {
      solicitudExistente.estado = "Diagnosticada";
    }
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
