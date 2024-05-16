import Proyecto from '../controllers/';
import Actividad from './models/actividad.model.js';

// Función para crear un nuevo proyecto
export const crearProyecto = async (nombre, actividades) => {
    try {
        const nuevoProyecto = new Proyecto({
            nombre,
            actividades
        });
        const proyectoGuardado = await nuevoProyecto.save();
        return proyectoGuardado;
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        throw new Error('Error al crear el proyecto');
    }
};

// Función para obtener todos los proyectos
export const obtenerTodosProyectos = async () => {
    try {
        const proyectos = await Proyecto.find().populate('actividades');
        return proyectos;
    } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        throw new Error('Error al obtener los proyectos');
    }
};

// Función para crear una nueva actividad
export const crearActividad = async (nombre) => {
    try {
        const nuevaActividad = new Actividad({ nombre });
        const actividadGuardada = await nuevaActividad.save();
        return actividadGuardada;
    } catch (error) {
        console.error('Error al crear la actividad:', error);
        throw new Error('Error al crear la actividad');
    }
};

// Función para obtener todas las actividades
export const obtenerTodasActividades = async () => {
    try {
        const actividades = await Actividad.find();
        return actividades;
    } catch (error) {
        console.error('Error al obtener las actividades:', error);
        throw new Error('Error al obtener las actividades');
    }
};
