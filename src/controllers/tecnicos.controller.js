import Tecnicos from "../models/tecnicos.modal.js";
import InformeTecnico from "../models/InformeTec.modal.js";

// Obtener todos los técnicos
export const verTodosLosTecnicos = async (req, res) => {
  try {
    const tecnicos = await Tecnicos.find();
    res.status(200).json(tecnicos);
  } catch (error) {
    console.error("Error al obtener técnicos:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener técnicos", error: error.message });
  }
};

// Crear un nuevo técnico
export const crearPerfilTecnico = async (req, res) => {
  try {
    const { nombreCompleto, edad, telefono, correo } = req.body;
    const nuevoTecnico = new Tecnicos({
      nombreCompleto,
      edad,
      telefono,
      correo,
    });
    await nuevoTecnico.save();
    res.status(201).json({ mensaje: "Técnico creado con éxito", nuevoTecnico });
  } catch (error) {
    console.error("Error al crear técnico:", error);
    res
      .status(500)
      .json({ mensaje: "Error al crear técnico", error: error.message });
  }
};

// Obtener un técnico por ID
export const obtenerTecnicoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const tecnico = await Tecnicos.findById(id);
    if (!tecnico) {
      return res.status(404).json({ mensaje: "Técnico no encontrado" });
    }
    res.status(200).json(tecnico);
  } catch (error) {
    console.error("Error al obtener técnico:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener técnico", error: error.message });
  }
};

// Obtener la descripción del informe técnico por ID
export const traeDescripcionTecnInforId = async (req, res) => {
  try {
    const informe = await InformeTecnico.findById(req.params.id).select(
      "folio informe tecnicos"
    );

    if (!informe) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }

    if (!informe.tecnicos || informe.tecnicos.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No hay técnicos asociados con este informe" });
    }

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

// Actualizar un técnico
export const actualizarTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreCompleto, edad, telefono, correo } = req.body;

    const tecnico = await Tecnicos.findById(id);
    if (!tecnico) {
      return res.status(404).json({ mensaje: "Técnico no encontrado" });
    }
    tecnico.nombreCompleto = nombreCompleto || tecnico.nombreCompleto;
    tecnico.edad = edad || tecnico.edad;
    tecnico.telefono = telefono || tecnico.telefono;
    tecnico.correo = correo || tecnico.correo;
    await tecnico.save();
    res.status(200).json({ mensaje: "Técnico actualizado con éxito", tecnico });
  } catch (error) {
    console.error("Error al actualizar técnico:", error);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar técnico", error: error.message });
  }
};

// Eliminar un técnico
export const eliminarTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const tecnicoEliminado = await Tecnicos.findByIdAndDelete(id);
    if (!tecnicoEliminado) {
      return res.status(404).json({ mensaje: "Técnico no encontrado" });
    }
    res.status(200).json({ mensaje: "Técnico eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar técnico:", error);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar técnico", error: error.message });
  }
};

// Desactivar un técnico
export const desactivarTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tecnico = await Tecnicos.findById(id);
    if (!tecnico) {
      return res.status(404).json({ mensaje: "Técnico no encontrado" });
    }
    tecnico.activo = false;
    await tecnico.save();
    res.status(200).json({ mensaje: "Técnico desactivado con éxito", tecnico });
  } catch (error) {
    console.error("Error al desactivar técnico:", error);
    res
      .status(500)
      .json({ mensaje: "Error al desactivar técnico", error: error.message });
  }
};
