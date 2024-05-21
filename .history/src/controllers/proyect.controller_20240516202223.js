import Proyecto from '../models/proyecto.modal.js';

export const crearProyecto = async (req, res) => {
    try {
      const { nombre, actividades } = req.body;

      const nuevoProyecto = new Proyecto({
        nombre,
        actividades,
      });
  
      await nuevoProyecto.save();
  
      // Enviar una respuesta con el nuevo proyecto creado
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
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};




export const obtenerIdsYNombreProyectos = async (req, res) => {
  try {
  
    const proyectos = await Proyecto.find({}, '_id nombre');

    res.json(proyectos);
  } catch (error) {
    console.error("Error al obtener IDs y nombres de proyectos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const eliminarProyecto = async (req, res) => {
    try {
        const proyectoEliminado = await Proyecto.findByIdAndDelete(req.params.id);
        if (!proyectoEliminado) {
            return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
