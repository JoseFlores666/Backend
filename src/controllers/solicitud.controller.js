import Solicitud from "../models/solicitud.modal.js";
import Estados from "../models/estados.modal.js";
import HistorialSoli from "../models/historialSoli.model.js";

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
      })
      .populate({
        path: "estado", // Campo de referencia a la colección de actividades en el esquema de Solicitud
        select: "nombre id", // Selecciona solo el campo nombre de la actividad
      })
      .lean(); //permite modificar los datos directamente sin afectar la base de datos

    solicitudes.forEach((solicitud) => {
      solicitud.fecha = solicitud.fecha.toLocaleDateString("es-MX");
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
      fecha,
      justificacion,
      items,
      user,
    } = req.body;
    console.log(user);
    const id = user.id;
    const estado = await Estados.findOne({ id: 1 });

    const nuevaSolicitud = new Solicitud({
      tipoSuministro: suministro,
      procesoClave: pc,
      proyecto,
      actividades: actividad,
      fecha,
      firmas: "664d5e645db2ce15d4468548",
      justificacionAdquisicion: justificacion,
      user: id,
      suministros: items,
      estado: estado._id,
    });

    estado.cantidadTotal = (estado.cantidadTotal || 0) + 1;

    await estado.save();
    await nuevaSolicitud.save();

    const historial = new HistorialSoli({
      user: id,
      fecha: new Date(),
      hora: new Date().toLocaleTimeString(),
      numeroDeSolicitud: nuevaSolicitud._id,
      folio: nuevaSolicitud.folio, // Verifica que 'folio' esté en el modelo de Solicitud
      numeroDeEntrega: nuevaSolicitud.numeroDeEntrega || "", // Asegúrate de que este campo esté en el modelo de Solicitud
      descripcion: `El usuario ${user.username} creó la solicitud:`,
      accion: "Creación de la solicitud",
    });

    await historial.save();
    res.status(201).json({ mensaje: "Solicitud agregada correctamente" });
  } catch (error) {
    console.error("Error al agregar solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarUnaSolicitud = async (req, res) => {
  try {
    const { user } = req.body; 
    console.log(req.body);
    const solicitud = await Solicitud.findById(req.params.id).populate({
      path: "estado",
      select: "id nombre cantidadTotal",
    });

    if (!solicitud) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    const id = user.id;
    console.log(id);

    const estado = await Estados.findOne({ id: solicitud.estado.id });

    const historial = new HistorialSoli({
      user: id,
      fecha: new Date(),
      hora: new Date().toLocaleTimeString(),
      numeroDeSolicitud: solicitud._id,
      folio: solicitud.folio, // Verifica que 'folio' esté en el modelo de Solicitud
      numeroDeEntrega: solicitud.numeroDeEntrega || "", // Asegúrate de que este campo esté en el modelo de Solicitud
      descripcion: `El usuario ${user.username} Elimino la solicitud:`,
      accion: "Eliminacion de la solicitud",
    });

    await historial.save();

    await Solicitud.findByIdAndDelete(req.params.id);

    estado.cantidadTotal = (estado.cantidadTotal || 0) - 1;

    await estado.save();
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const verSolicitudesPorEstado = async (req, res) => {
  try {
    const { estadoId } = req.params;
    const estadoNumero = Number(estadoId);

    // Verificar si la conversión a número fue exitosa (si es un número en tu caso)
    if (isNaN(estadoNumero)) {
      return res.status(400).json({
        mensaje: "ID de estado inválido. Debe ser un número.",
      });
    }
    const solicitudes = await Solicitud.find({ estado: estadoId });

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

    const { suministro, pc, proyecto, actividad, fecha, justificacion, items } =
      req.body;

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

    const soli = await Solicitud.findById(id);

    if (!soli) {
      return res.status(500).json({ mensaje: "Solicitud no encontrada" });
    }
    if (soli.folioExterno === folioExterno) {
      return res.status(500).json({ mensaje: " Error folio duplicado" });
    }

    const estado = await Estados.findOne({ id: 2 });

    if (folioExterno && estado) {
      soli.folioExterno = folioExterno;
      soli.estado = estado._id;

      estado.cantidadTotal = (estado.cantidadTotal || 0) + 1;
      await estado.save();
      await soli.save();

      res.json(soli);
      console.log("Solicitud actualizada exitosamente");
    }
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarSolicitudEstado = async (req, res) => {
  try {
    const { id } = req.params;

    const soli = await Solicitud.findById(id);

    if (!soli) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }
    const estado = await Estados.findOne({ id: 5 });

    soli.estado = estado._id;
    estado.cantidadTotal = (estado.cantidadTotal || 0) + 1;
    await estado.save();

    await soli.save();

    res.status(200).json(soli);
    console.log("Solicitud actualizada exitosamente");
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const verUnaSolicitudPorId = async (req, res) => {
  try {
    const id = req.params.id;

    const solicitud = await Solicitud.findById(id)
      .populate({
        path: "proyecto",
        select: "nombre",
      })
      .populate({
        path: "actividades",
        select: "nombre",
      })
      .populate({
        path: "estado",
        select: "nombre",
      });

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
