import Actividad from '../models/actividad.modal.js';

export const crearActividad = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const nuevaActividad = new Actividad({ nombre,descripcion });
        await nuevaActividad.save();
        res.status(201).json({ mensaje: 'Actividad creada correctamente' });
    } catch (error) {
        console.error('Error al crear actividad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const obtenerActividades = async (req, res) => {
    try {
        const actividades = await Actividad.find();
        res.json(actividades);
    } catch (error) {
        console.error('Error al obtener actividades:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
export const obtenerActividadesPorId = async (req, res) => {
    try {
        const actividades = await Actividad.findById();
        res.json(actividades);
    } catch (error) {
        console.error('Error al obtener actividades:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminarActividad = async (req, res) => {
    try {
        const actividadEliminada = await Actividad.findByIdAndDelete(req.params.id);
        if (!actividadEliminada) {
            return res.status(404).json({ mensaje: 'Actividad no encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar actividad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
