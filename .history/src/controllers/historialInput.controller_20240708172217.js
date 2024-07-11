import InformeTecnico from "../models/InformeTec.modal.js";

import InformeTecnico from "./ruta/al/esquema/InformeTecnico";

export const verTodosInformes = async (req, res) => {
  try {
    const informes = await InformeTecnico.find({}, { informe: 1, solicitud: 1 });
    res.json(informes);
  } catch (error) {
    console.error("Error al obtener informes técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
