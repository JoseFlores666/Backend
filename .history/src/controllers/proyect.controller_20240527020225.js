import Proyecto from "../models/proyecto.modal.js";

export const crearProyecto = async (req, res) => {
  try {
    const { nombre, actividades } = req.body;
    const nuevoProyecto = new Proyecto({
      nombre,
      actividades,
    });
    await nuevoProyecto.save();
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find();
    res.json(proyectos);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerIdsYNombreProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({}, "_id nombre");
    res.json(proyectos);
  } catch (error) {
    console.error("Error al obtener IDs y nombres de proyectos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerProyectoYActividades = async (req, res) => {
  try {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id).populate('actividades');

    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json(proyecto);
  } catch (error) {
    console.error('Error al obtener proyecto con actividades:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export const eliminarProyecto = async (req, res) => {
  try {
    const { _id } = req.params;
    const proyectoEliminado = await Proyecto.findByIdAndDelete(_id);
    if (!proyectoEliminado) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar proyecto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerProyectoYActividad = async (req, res) => {
  try {
    const { proyectoId, actividadId } = req.params;

    // Buscar el proyecto por ID y popular las actividades
    const proyecto = await Proyecto.findById(proyectoId).populate('actividades');

    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Buscar la actividad dentro de las actividades del proyecto
    const actividad = proyecto.actividades.find(act => act._id.toString() === actividadId);

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada en el proyecto' });
    }

    // Extraer y devolver los nombres del proyecto y de la actividad
    res.json({ nombreProyecto: proyecto.nombre, nombreActividad: actividad.nombre });
  } catch (error) {
    console.error('Error al obtener proyecto y actividad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};