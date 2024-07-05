import Api_key from "../models/Api_key.modal.js";

export const obtenerApi_key = async (req, res) => {
  try {
    const api_key = await Api_key.find();
    res.json(api_key);
  } catch (error) {
    console.error("Error al obtener las api_key:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarApi_key = async (req, res) => {
    try {
      const { id } = req.params;
  
      const soli = await Solicitud.findById(id);
  
      if (!soli) {
        return res.status(404).json({ mensaje: "Solicitud no encontrada" });
      }
  
      soli.estado = estado;
  
      await soli.save();
  
      res.status(200).json(soli);
      console.log("Solicitud actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };