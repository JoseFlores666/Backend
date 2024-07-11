// Importa el modelo de InformeTecnico
import InformeTecnico from "../models/InformeTec.modal.js";

export const verTodosInformes = async (req, res) => {
  try {
    const informes = await InformeTecnico.find(
      {},
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
