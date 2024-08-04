import Estados from "../models/estados.modal.js";
import Solicitud from "../models/solicitud.modal.js";

export const verEstados = async (req, res) => {
  try {
    const estados = await Estados.find();
    res.status(200).json(estados);
  } catch (error) {
    console.error("error al crear al consultar los estados");
    res.status(500).json({ message: error.message });
  }
};
export const VercantidadTotal = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find().populate("estado", "id").lean();

    const estados = await Estados.find().lean();

    // Mapea los estados para contar cuántas solicitudes tienen cada estado asignado
    const conteoEstados = estados.map((estado) => ({
      id: estado.id,
      nombre: estado.nombre,
      cantidadTotal: solicitudes.filter(
        (solicitud) => solicitud.estado && solicitud.estado.id === estado.id
      ).length,
    }));

    res.json(conteoEstados);
  } catch (error) {
    console.error("Error al obtener el conteo de solicitudes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const crearEstados = async (req, res) => {
  try {
    const { id, nombre } = req.body;

    if (id == null || nombre == null) {
      return res
        .status(400)
        .json({ mensaje: "ID y nombre del estado son requeridos" });
    }

    const estadoExistente = await Estados.findOne({ id });
    if (estadoExistente) {
      return res.status(400).json({ mensaje: "ID del estado ya existe" });
    }

    const nuevoEstado = new Estados({ id, nombre });

    await nuevoEstado.save();

    res.status(201).json({
      id: nuevoEstado.id,
      nombre: nuevoEstado.nombre,
      mensaje: "Estado creado exitosamente",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(500).json({ mensaje: error.message });
    }
  }
};

export const actualizarEstados = async (req, res) => {
  try {
    const estadosActualizados = req.body;

    if (
      !Array.isArray(estadosActualizados) ||
      estadosActualizados.length !== 5
    ) {
      return res.status(400).json({
        mensaje: "Se requiere un arreglo de 5 estados para actualizar",
      });
    }

    // Actualizar cada estado basado en su ID
    await Promise.all(
      estadosActualizados.map(({ id, nombre }) =>
        Estados.updateOne({ id }, { nombre })
      )
    );

    res.status(200).json({ mensaje: "Estados actualizados exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
