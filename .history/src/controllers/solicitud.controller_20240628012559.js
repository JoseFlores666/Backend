import Solicitud from "../models/solicitud.modal.js";

export const getTodasSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find()
      .populate({
        path: "proyecto", // Campo de referencia a la colección de proyectos en el esquema de Solicitud
        select: "nombre", // Selecciona solo el campo nombre del proyecto
      })
      .populate({
        path: "actividades", // Campo de referencia a la colección de actividades en el esquema de Solicitud
        select: "nombre", // Selecciona solo el campo nombre de la actividad
      });
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const crearUnaSolicitud = async (req, res) => {
  try {
    const {
      suministro,
      pc,
      proyecto,
      actividad,
      estado,
      fecha,
      justificacion,
      id,
      items,
    } = req.body;

    const nuevaSolicitud = new Solicitud({
      tipoSuministro: suministro,
      procesoClave: pc,
      proyecto,
      actividades: actividad,
      estado,
      fecha,
      firmas: "664d5e645db2ce15d4468548",
      justificacionAdquisicion: justificacion,
      user: id,
      suministros: items,
    });

    await nuevaSolicitud.save();

    res.status(201).json({ mensaje: "Solicitud agregada correctamente" });
  } catch (error) {
    console.error("Error al agregar solicitud:", error);
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

export const verSolicitudesPorEstado = async (req, res) => {
  try {
    const { datosSolicitud } = req.params;
    const estadosValidos = [
      "Pendiente",
      "Asignada",
      "Diagnosticada",
      "Atendida",
      "Rechazada",
    ];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        mensaje: `Estado inválido. Debe ser uno de los siguientes: ${estadosValidos.join(
          ", "
        )}`,
      });
    }

    const solicitudes = await Solicitud.find({ estado });

    if (solicitudes.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron solicitudes para el estado proporcionado",
      });
    }

    res.json(solicitudes);
    console.log("Búsqueda exitosa");
  } catch (error) {
    console.error("Error al obtener solicitudes por estado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const editarUnaSolicitud = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      folioExterno,
      suministro,
      pc,
      proyecto,
      actividad,
      fecha,
      justificacion,
      items,
      estado,
    } = req.body;

    // Busca la solicitud existente por su ID
    const soli = await Solicitud.findById(id);
    if (!soli) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    soli.tipoSuministro = suministro;
    soli.procesoClave = pc;
    soli.proyecto = proyecto;
    soli.actividades = actividad;
    soli.fecha = fecha;
    soli.justificacionAdquisicion = justificacion;
    soli.suministros = items;
    soli.user = id;

    if (estado && folioExterno) {
      soli.estado = estado;
      soli.folioExterno = folioExterno;
    }

    await soli.save();

    res.json(soli);
    console.log("Solicitud actualizada exitosamente");
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const editarSolicitudFolioExterno = async (req, res) => {
  try {
    const { id } = req.params;

    const { folioExterno } = req.body;
    const estado = "Asignada";

    const soli = await Solicitud.findById(id);
    if (!soli) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    soli.folioExterno = folioExterno;
    soli.estado = estado;

    await soli.save();

    res.json(soli);
    console.log("Solicitud actualizada exitosamente");
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const verUnaSolicitudPorId = async (req, res) => {
  try {
    const id = req.params.id;

    const solicitud = await Solicitud.findById(id);
    if (!solicitud) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    console.log("Búsqueda exitosa");
    res.json(solicitud);
  } catch (error) {
    console.error("Error al obtener solicitud por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
