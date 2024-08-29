import Proyecto from "../models/proyecto.modal.js";
import Actividad from "../models/actividad.modal.js";

export const crearProyecto = async (req, res) => {
  try {
    const { nombre } = req.body;
    console.log(req.body);

    const nuevoProyecto = new Proyecto({
      nombre,
    });
    await nuevoProyecto.save();
    res
      .status(201)
      .json({ nuevoProyecto, mensaje: "El proyecto fue creado con exito" });
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    res
      .status(500)
      .json({ message: "Error al crear el proyecto", error: error.message });
  }
};
export const asignarActividadProyec = async (req, res) => {
  try {
    const { id } = req.params;
    const { idActividades } = req.body;
    console.log(req.body);

    // Asegúrate de que idActividades sea un array
    const ids = Array.isArray(idActividades) ? idActividades : [idActividades];

    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    // Encuentra las actividades por sus IDs
    const actividades = await Actividad.find({ _id: { $in: ids } });
    if (actividades.length !== ids.length) {
      return res
        .status(404)
        .json({ error: "Una o más actividades no se encontraron" });
    }

    // Asigna las actividades al proyecto (sin duplicados)
    ids.forEach((actId) => {
      if (!proyecto.actividades.includes(actId)) {
        proyecto.actividades.push(actId);
      }
    });

    await proyecto.save();
    res
      .status(201)
      .json({ mensaje: "Actividades asignadas al proyecto con éxito" });
  } catch (error) {
    console.error("Error al asignar actividades al proyecto:", error);
    res.status(500).json({
      message: "Error al asignar actividades al proyecto",
      error: error.message,
    });
  }
};
export const obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().populate({
      path: "actividades",
      select: "nombre descripcion",
    });
    
    if (!proyectos) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json(proyectos);
  } catch (error) {
    console.error(":", error);
    res
      .status(500)
      .json({ message: "Error al obtener proyectos", error: error.message });
  }
};
export const getActSinAsignar = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({}, "actividades"); // Obtener solo el campo actividades de todos los proyectos

    // Extraer los IDs de todas las actividades asignadas
    const actividadesAsignadas = proyectos.flatMap((proyecto) =>
      proyecto.actividades.map((act) => act._id)
    );

    // 2. Buscar todas las actividades que NO están en la lista de actividades asignadas
    const actividadesNoAsignadas = await Actividad.find({
      _id: { $nin: actividadesAsignadas }, // `$nin` busca actividades cuyo `_id` no esté en `actividadesAsignadas`
    });

    res.status(200).json(actividadesNoAsignadas);
  } catch (error) {
    console.log(
      "Error al intentar consultar las actividades sin consultar",
      error
    );
    res.status(500).json({
      message: "Error al obtener las actividades sin asignar",
      error: error.message,
    });
  }
};

export const obtenerIdsYNombreProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({}, "_id nombre").populate({
      path: "actividades",
      select: "nombre descripcion",
    });
    if (!proyectos) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.json(proyectos);
  } catch (error) {
    console.error("Error al obtener IDs y nombres de proyectos:", error);
    res.status(500).json({
      message: "Error al obtener IDs y nombres de proyectos",
      error: error.message,
    });
  }
};

export const obtenerProyectoYActividades = async (req, res) => {
  try {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id).populate("actividades");

    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json({ proyecto });
  } catch (error) {
    console.error("Error al obtener proyecto con actividades:", error);
    res.status(500).json({
      message: "Error al obtener proyecto con actividades",
      error: error.message,
    });
  }
};

export const eliminarProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const proyectoEliminado = await Proyecto.findByIdAndDelete(id)
    if (!proyectoEliminado) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    // Eliminar las actividades asociadas al proyecto
    await Actividad.deleteMany({ _id: { $in: proyectoEliminado.actividades } });

    res.status(200).json({ mensaje: "Proyecto eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar proyecto", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Error al eliminar proyecto",
        error: error.message,
      });
    }
  }
};

export const obtenerProyectoYActividad = async (req, res) => {
  try {
    const { proyectoId, actividadId } = req.params;

    const proyecto = await Proyecto.findById(proyectoId).populate(
      "actividades"
    );

    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    const actividad = proyecto.actividades.find(
      (act) => act._id.toString() === actividadId
    );

    if (!actividad) {
      return res
        .status(404)
        .json({ message: "Actividad no encontrada en el proyecto" });
    }

    res.json({
      nombreProyecto: proyecto.nombre,
      nombreActividad: actividad.nombre,
    });
  } catch (error) {
    console.error("Error al obtener proyecto y actividad", error);
    res.status(500).json({
      message: "Error al obtener proyecto y actividad",
      error: error.message,
    });
  }
};

export const ProyectCrearActYAsignarle = async (req, res) => {
  try {
    const { id } = req.params;
    const { actividades } = req.body;

    if (
      !actividades ||
      !Array.isArray(actividades) ||
      actividades.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Debe proporcionar un array de actividades" });
    }

    // Crear nuevas actividades
    const nuevasActividades = await Actividad.insertMany(actividades);

    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    // Asigna las actividades recién creadas al proyecto
    proyecto.actividades.push(...nuevasActividades.map((act) => act._id));

    await proyecto.save();

    res.status(201).json({
      mensaje: "Actividades creadas y asignadas al proyecto con éxito",
    });
  } catch (error) {
    console.error("Error al crear y asignar actividades:", error);
    res.status(500).json({
      message: "Error al crear y asignar actividades",
      error: error.message,
    });
  }
};

export const editarProyecto = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body; // actividades será un array de objetos {id, nombre, descripcion}

  console.log(req.body);

  try {
    // 1. Actualizar el nombre del proyecto si es necesario
    const proyect = await Proyecto.findById(id);

    if (!proyect) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    if (nombre !== undefined && nombre.trim() !== "") {
      proyect.nombre = nombre;

      await proyect.save();

      res.status(200).json({
        mensaje: "Proyecto actualizado con éxito",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el proyecto", error });
  }
};

export const desenlazarActividadProyec = async (req, res) => {
  try {
    const { id } = req.params;
    const { idActividad } = req.body;
    console.log(req.body);

    // Buscar el proyecto
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    // Verificar si la actividad está en el proyecto
    const actividadExiste = proyecto.actividades.some(
      (actId) => actId.toString() === idActividad
    );
    if (!actividadExiste) {
      return res
        .status(404)
        .json({ error: "Actividad no encontrada en el proyecto" });
    }

    // Eliminar la actividad del array de actividades del proyecto
    proyecto.actividades = proyecto.actividades.filter(
      (actId) => actId.toString() !== idActividad
    );

    // Guardar el proyecto actualizado
    await proyecto.save();

    res
      .status(200)
      .json({ mensaje: "Actividad desenlazada del proyecto con éxito" });
  } catch (error) {
    console.error("Error al desenlazar actividad del proyecto:", error);
    res.status(500).json({
      message: "Error al desenlazar actividad del proyecto",
      error: error.message,
    });
  }
};
