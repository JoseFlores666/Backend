import Actividad from "../models/actividad.modal.js";

export const crearActividad = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const nuevaActividad = new Actividad({ nombre, descripcion });
    await nuevaActividad.save();
    res.status(201).json({ mensaje: "Actividad creada correctamente" });
  } catch (error) {
    console.error("Error al crear actividad:", error);
    res
      .status(500)
      .json({ message: "Error al crear la actividad", error: error.message });
  }
};

export const obtenerActividades = async (req, res) => {
  try {
    const actividades = await Actividad.find();
    res.json(actividades);
  } catch (error) {
    console.error("Error al obtener actividades:", error);
    res
      .status(500)
      .json({ message: "Error al crear la actividad", error: error.message });
  }
};
export const obtenerActividadesPorId = async (req, res) => {
  try {
    const actividades = await Actividad.findById(idActSelect);
    res.json(actividades);
  } catch (error) {
    console.error("Error al obtener actividades:", error);
    res
      .status(500)
      .json({ message: "Error al crear la actividad", error: error.message });
  }
};

export const actualizarActividad = async (req, res) => {
  try {
    const { id } = req.params; 
    const { nombre, descripcion } = req.body;

    const actividadActualizada = await Actividad.findByIdAndUpdate(
      id,
      { nombre, descripcion },
      { new: true }  // Devuelve el documento actualizado
    );

    if (!actividadActualizada) {
      return res.status(404).json({ mensaje: "Actividad no encontrada" });
    }

    res.json({ mensaje: "Actividad actualizada correctamente", actividad: actividadActualizada });
  } catch (error) {
    console.error("Error al actualizar actividad:", error);
    res.status(500).json({ message: "Error al actualizar la actividad", error: error.message });
  }
};
export const eliminarActividad = async (req, res) => {
  try {
    const actividadEliminada = await Actividad.findByIdAndDelete(req.params.id);
    if (!actividadEliminada) {
      return res.status(404).json({ mensaje: "Actividad no encontrada" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar actividad:", error);
    res
      .status(500)
      .json({ message: "Error al crear la actividad", error: error.message });
  }
};
