// Importa el modelo de InformeTecnico
import InformeTecnico from "../models/InformeTec.modal.js";

// Controlador para obtener todos los informes técnicos
export const verTodosInformes = async (req, res) => {
  try {
    // Consulta para obtener todos los informes técnicos
    const informes = await InformeTecnico.find(
      {}, // Filtro vacío para obtener todos los documentos
      {
        // Proyección para incluir solo los campos necesarios
        descripcionDelServicio: 1,
        Observacionestecnicas: 1,
      }
    );

    // Devuelve los informes en formato JSON
    res.json(informes);
  } catch (error) {
    console.error("Error al obtener informes técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
