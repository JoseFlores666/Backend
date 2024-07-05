import Api_key from "../models/Api_key.modal.js";

export const obtenerApi_ = async (req, res) => {
    try {
      const proyectos = await Proyecto.find();
      res.json(proyectos);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  