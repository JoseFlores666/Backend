import Solicitud from "../models/solicitud.modal.js";
// import Actividad from "../models/actividad.modal.js";
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
        path: "actividades.actividadRef", // Campo de referencia a la colección de actividades en el esquema de Solicitud
        select: "nombre", // Selecciona solo el campo nombre de la actividad
      })
      .populate({
        path: "estado",
        select: "nombre id",
      })
      .lean(); // Permite modificar los datos directamente sin afectar la base de datos

    solicitudes.forEach((solicitud) => {
      solicitud.actividades = solicitud.actividades.map((actividad) => ({
        ...actividad,
        nombreActividad: actividad.actividadRef
          ? actividad.actividadRef.nombre
          : actividad.nombreActividad,
      }));
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
      selectedActividad,
      fecha,
      justificacion,
      items,
      user,
    } = req.body;
    console.log(req.body);
    const id = user.id;

    const estado = await Estados.findOne({ id: 1 });

console.log(selectedActividad)

    const nuevaSolicitud = new Solicitud({
      tipoSuministro: suministro,
      procesoClave: pc,
      proyecto,
      actividades: [
        {
          actividadRef: selectedActividad.id,
          nombreActividad: selectedActividad.nombre,
        },
      ],
      fecha,
      firmas: "664d5e645db2ce15d4468548",
      justificacionAdquisicion: justificacion,
      user: id,
      suministros: items,
      estado: estado._id,
    });

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

    const historial = new HistorialSoli({
      user: user.id,
      fecha: new Date(),
      hora: new Date().toLocaleTimeString(),
      numeroDeSolicitud: solicitud._id,
      folio: solicitud.folio, // Verifica que 'folio' esté en el modelo de Solicitud
      numeroDeEntrega: solicitud.numeroDeEntrega || "", // Asegúrate de que este campo esté en el modelo de Solicitud
      descripcion: `El usuario ${user.username} Elimino la solicitud:`,
      accion: "Eliminación de la solicitud",
    });

    await historial.save();

    await Solicitud.findByIdAndDelete(req.params.id);

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

    const {
      suministro,
      pc,
      proyecto,
      selectedActividad,
      user,
      fecha,
      justificacion,
      items,
    } = req.body;

    const soli = await Solicitud.findById(id);
    if (!soli) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    soli.tipoSuministro = suministro;
    soli.procesoClave = pc;
    soli.proyecto = proyecto;
  soli.actividades[0] = {
      actividadRef: selectedActividad.id,
      nombreActividad: selectedActividad.nombre,
    };
    soli.fecha = fecha;
    soli.justificacionAdquisicion = justificacion;
    soli.suministros = items;
    soli.user = user.id;

    await soli.save();

    const historial = new HistorialSoli({
      user: user.id,
      fecha: new Date(),
      hora: new Date().toLocaleTimeString(),
      numeroDeSolicitud: soli._id,
      folio: soli.folio,
      numeroDeEntrega: soli.numeroDeEntrega || "",
      descripcion: `El usuario ${user.username} actualizo la solicitud:`,
      accion: "Actualización de la solicitud",
    });

    await historial.save();

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

    const { folioExterno, user } = req.body;
    console.log(user);
    const soli = await Solicitud.findById(id);

    if (!soli) {
      return res.status(500).json({ mensaje: "Solicitud no encontrada" });
    }

    const estado = await Estados.findOne({ id: 2 });

    if (folioExterno && estado) {
      soli.folioExterno = folioExterno;
      soli.estado = estado._id;

      await soli.save();

      const historial = new HistorialSoli({
        user: user.id,
        fecha: new Date(),
        hora: new Date().toLocaleTimeString(),
        numeroDeSolicitud: soli._id,
        folio: soli.folio,
        numeroDeEntrega: soli.numeroDeEntrega || "",
        descripcion: `El usuario ${user.username} asignó un folio a la solicitud:`,
        accion: "Asignación del folio",
      });

      await historial.save();

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

    const { user } = req.body;

    const soli = await Solicitud.findById(id);

    if (!soli) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    const estado = await Estados.findOne({ id: 5 });

    soli.estado = estado._id;

    await soli.save();

    const historial = new HistorialSoli({
      user: user.id,
      fecha: new Date(),
      hora: new Date().toLocaleTimeString(),
      numeroDeSolicitud: soli._id,
      folio: soli.folio,
      numeroDeEntrega: soli.numeroDeEntrega || "",
      descripcion: `El usuario ${user.username} Rechazó la solicitud:`,
      accion: "Rechazo de la solicitud",
    });

    await historial.save();

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

    // Obtén la solicitud con la población inicial
    const solicitud = await Solicitud.findById(id)
      .populate({
        path: "proyecto",
        select: "nombre",
      })
      .populate({
        path: 'actividades',  // Populate the 'actividadRef' field within 'actividades'
        select: 'nombre actividadRef',  // Select specific fields from the 'Actividad' model
      })
      .lean();

    if (!solicitud) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    res.json(solicitud);
  } catch (error) {
    console.error("Error al obtener solicitud por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
