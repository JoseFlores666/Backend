import InformeTecnico from "../models/InformeTec.modal.js";

export const verTodosInformes = async (req, res) => {
  try {
    const informes = await InformeTecnico.find({}, { "solicitud.insumosSolicitados.descripcion": 1 });
    res.json(informes);
  } catch (error) {
    console.error("Error al obtener informes técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
