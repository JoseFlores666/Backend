import Firma from "../models/firmas.modal.js";

// Crear una nueva firma
export const crearFirma = async (req, res) => {
  try {
    const { solicitud, revision, validacion, autorizacion } = req.body;
    const nuevaFirma = new Firma({
      solicitud,
      revision,
      validacion,
      autorizacion,
    });
    await nuevaFirma.save();
    res.status(201).json({ mensaje: "Firma creada correctamente" });
  } catch (error) {
    console.error("Error al crear firma:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todas las firmas
export const obtenerFirmas = async (req, res) => {
  try {
    const firmas = await Firma.find();
    res.json(firmas);
  } catch (error) {
    console.error("Error al obtener firmas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener una firma por ID
export const obtenerFirmaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const firma = await Firma.findById(id);
    if (!firma) {
      return res.status(404).json({ mensaje: "Firma no encontrada" });
    }
    res.json(firma);
  } catch (error) {
    console.error("Error al obtener firma:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarFirma = async (req, res) => {
  try {
    const { id } = req.params; 
    
    const { solicitante, jefeInmediato, direccion, autorizacion } = req.body;
    const firmaEditada = await Firma.findByIdAndUpdate(
      id,
      { solicitud, revision, validacion, autorizacion },
      { new: true }
    );
    if (!firmaEditada) {
      return res.status(404).json({ mensaje: "Firma no encontrada" });
    }
    res.json(firmaEditada);
  } catch (error) {
    console.error("Error al editar firma:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}; 

// Eliminar una firma
export const eliminarFirma = async (req, res) => {
  try {
    const { id } = req.params;
    const firmaEliminada = await Firma.findByIdAndDelete(id);
    if (!firmaEliminada) {
      return res.status(404).json({ mensaje: "Firma no encontrada" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar firma:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
