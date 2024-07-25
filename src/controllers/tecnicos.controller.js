import Tecnicos from "../models/tecnicos.modal.js";

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
