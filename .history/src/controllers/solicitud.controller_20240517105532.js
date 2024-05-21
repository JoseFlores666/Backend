import Solicitud from "../models/solicitud.modal.js";

export const getTodasSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find();
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const crearUnaSolicitud = async (req, res) => {
  try {
    const {
      folio,
      tipoSuministro,
      procesoClave,
      suministros,
      proyecto,
      actividades,
      estado,
      fecha,
      firmas,
      justificacionAdquisicion,
      user,
    } = req.body;

    const nuevaSolicitud = new Solicitud({
      folio,
      tipoSuministro,
      procesoClave,
      suministros,
      proyecto,
      actividades,
      estado,
      fecha,
      firmas,
      justificacionAdquisicion,
      user,
     
    });

    await nuevaSolicitud.save();

    res.status(201).json({ mensaje: "Solicitud agregada correctamente" });
  } catch (error) {
    console.error("Error al agregar solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const verUnaSolicitudPorId = async (req, res) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id)
    if (!solicitud) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }
    res.json(solicitud);
  } catch (error) {
    console.error("Error al obtener solicitud por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarUnaSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findByIdAndDelete(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarUnaSolicitud = async (req, res) => {
  try {
    const { _id } = req.params;
    const {
      areaSolicitante,
      fecha,
      tipoSuministro,
      procesoClave,
      area,
      suministros,
      proyecto,
      actividades,
      justificacionAdquisicion,
      firmas,

      estado,
    } = req.body;

    const solicitudModificada = await Solicitud.findByIdAndUpdate(
      _id,
      {
        areaSolicitante,
        fecha,
        tipoSuministro,
        procesoClave,
        area,
        suministros,
        proyecto,
        actividades,
        justificacionAdquisicion,
        firmas,

        estado,
      },
      { new: true }
    )
      .populate("user")
      .populate("suministros actividades");

    if (!solicitudModificada) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    res.json({
      mensaje: "Solicitud modificada correctamente",
      solicitud: solicitudModificada,
    });
  } catch (error) {
    console.error("Error al modificar solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
