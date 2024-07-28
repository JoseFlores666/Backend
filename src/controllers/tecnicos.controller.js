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
    // Busca el informe técnico por ID e incluye los campos necesarios
    const informe = await InformeTecnico.findById(req.params.id)
      .select("folio informe tecnicos");

    if (!informe) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }

    // Verifica si hay técnicos asociados al informe
    if (!informe.tecnicos || informe.tecnicos.length === 0) {
      return res.status(404).json({ mensaje: "No hay técnicos asociados con este informe" });
    }

    // Busca los técnicos asociados al informe
    const tecnicos = await Tecnicos.find({ _id: { $in: informe.tecnicos } });

    res.json({
      folio: informe.folio,
      descripcionDelServicio: informe.informe?.descripcionDelServicio || null,
      tecnicos,
    });
  } catch (error) {
    console.error("Error al obtener informe técnico por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};