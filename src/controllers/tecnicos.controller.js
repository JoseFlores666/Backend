import Tecnicos from "../models/tecnicos.modal.js";
import InformeTecnico from "../models/InformeTec.modal.js";

export const verTodosLosTecnicos = async (req, res) => {
  try {
    const tecnicos = await Tecnicos.find();
    res.json(tecnicos);
  } catch (error) {
    console.log("error al consultar la coleccion Técnicos");
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const crearPerfilTecnico = async (req, res) => {
  try {
    const { nombreCompleto, edad, telefono, correo, area } = req.body;

    const tecnico = new Tecnicos({
      nombreCompleto,
      edad,
      telefono,
      correo,
      area,
    });
    await tecnico.save();
    res.json({ mensaje: "Creado perfil del técnico creado con exito" });
  } catch (error) {
    console.log("error al consultar al crear el perfil del tecnico");
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const traeDescripcionTecnInforId = async (req, res) => {
  try {
    const { idTecnico } = req.body;
    const informe = await InformeTecnico.findById(req.params.id).select(
      "informe.descripcionDelServicio tecnicos"
    );

    if (!informe) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }

    if (!informe.tecnicos || informe.tecnicos.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No hay técnicos asociados con este informe" });
    }

    const tecnico = await Tecnicos.findById(informe.tecnicos);

    res.json({
      descripcionDelServicio: informe.informe.descripcionDelServicio,
      tecnico,
    });
  } catch (error) {
    console.error("Error al obtener informe técnico por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
