import Solicitud from "../models/solicitud.modal.js";
import Estados from "../models/estados.modal.js";
import HistorialSoli from "../models/historialSoli.model.js";

export const abonarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, user } = req.body;

    console.log(items);
    const solicitudExistente = await Solicitud.findById(id);
    if (!solicitudExistente) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    const estado2 = await Estados.findOne({ id: 2 });
    const estado3 = await Estados.findOne({ id: 3 });
    const estado4 = await Estados.findOne({ id: 4 });

    let abonoRealizado = false;
    let allItemsCompleted = true;
    let numeroTotalDeEntregas = 0; // Inicializamos el total de entregas

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const suministro = solicitudExistente.suministros[i];

      if (suministro) {
        if (!suministro.cantidadAcumulada) {
          suministro.cantidadAcumulada = 0;
        }

        const cantidadEntregada = parseInt(item.cantidadEntregada, 10);

        if (cantidadEntregada > 0) {
          const nuevaCantidadAcumulada =
            suministro.cantidadAcumulada + cantidadEntregada;

          if (nuevaCantidadAcumulada <= suministro.cantidad) {
            suministro.cantidadAcumulada = nuevaCantidadAcumulada;
            suministro.cantidadEntregada = 0;
            suministro.NumeroDeEntregas =
              (suministro.NumeroDeEntregas || 0) + 1;

            numeroTotalDeEntregas += suministro.NumeroDeEntregas;

            if (suministro.NumeroDeEntregas > 0) {
              abonoRealizado = true;
            }

            // Ajuste en la condición para determinar si un ítem está completado
            if (suministro.cantidadAcumulada < suministro.cantidad) {
              allItemsCompleted = false;
            }
          } else {
            return res.status(400).json({
              error: `La cantidad acumulada no puede exceder la cantidad requerida para el suministro ${suministro._id}.`,
            });
          }
        } else if (suministro.cantidadAcumulada < suministro.cantidad) {
          // Este else se asegura de que si no hay cantidad entregada y la acumulada no es suficiente, la solicitud no se marca como completa.
          allItemsCompleted = false;
        }
      } else {
        return res.status(404).json({
          error: `Suministro ${suministro._id} no encontrado en la solicitud.`,
        });
      }
    }

    // Cambiar estado si es necesario
    if (abonoRealizado && solicitudExistente.estado.equals(estado2._id)) {
      solicitudExistente.estado = estado3._id;
      estado3.cantidadTotal = (estado3.cantidadTotal || 0) + 1;
      await estado3.save();
    }
    if (allItemsCompleted) {
      solicitudExistente.estado = estado4._id;
      estado4.cantidadTotal = (estado4.cantidadTotal || 0) + 1;
      await estado4.save();
    }

    // Guardar la solicitud actualizada
    await solicitudExistente.save();

    let descripcionDetallada = "";
    let numeroDeEntrega = "";

    items.forEach((item, index) => {
      const cantidadEntregada = parseInt(item.cantidadEntregada, 10) || 0;
      const unidad = item.unidad
        ? item.unidad.trim()
        : "unidad no especificada";
      const descripcion = item.descripcion
        ? item.descripcion.trim()
        : "descripción no especificada";
      const numeroDeEntregas =
        solicitudExistente.suministros[index].NumeroDeEntregas || 0;

      if (cantidadEntregada > 0) {
        descripcionDetallada += `Producto: ${descripcion}, Total de entregas: ${numeroDeEntregas}, Cantidad entregada: ${cantidadEntregada} ${unidad}.`;
        numeroDeEntrega += `Producto: ${descripcion}, Entregas realizadas: ${numeroDeEntregas}`;
        if (index < items.length - 1) {
          descripcionDetallada += " ";
          numeroDeEntrega += " ";
        }
      }
    });

    const historial = new HistorialSoli({
      user: user.id,
      fecha: new Date(),
      hora: new Date().toLocaleTimeString(),
      numeroDeSolicitud: solicitudExistente._id,
      folio: solicitudExistente.folio,
      numeroDeEntrega: numeroDeEntrega,
      descripcion: `El usuario ${user.username} abonó la solicitud con los siguientes productos: ${descripcionDetallada}`,
      accion: "Entrega de materiales",
    });

    await historial.save();

    return res.json({
      mensaje: "El abono se realizó exitosamente",
      solicitud: solicitudExistente,
    });
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    return res.status(500).json({ error: error.message });
  }
};
