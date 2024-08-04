import OrdenTrabajoEstados from "../models/estadosOrden.model.js";
import InformeTecnico from "../models/InformeTec.modal.js";

export const verEstadosOrdenTrabajo = async (req, res) => {
  try {
    const estados = await OrdenTrabajoEstados.find()
      .populate("informe.estado", "id nombre") // `estado` debe coincidir con el nombre del campo en el esquema
      .lean();

    res.status(200).json(estados);
  } catch (error) {
    console.error("Error al consultar los estados de orden de trabajo:", error);
    res.status(500).json({
      message: "Error al consultar los estados de orden de trabajo",
      error: error.message,
    });
  }
};

export const vercantidadTotalOrdenTrabajoEstados = async (req, res) => {
  try {
    const ordenesDeTrabajo = await InformeTecnico.find()
      .populate("informe.estado", "id")
      .lean();
    // Obtén todos los estados
    const estados = await OrdenTrabajoEstados.find().lean();

    // Mapea los estados para contar cuántas solicitudes tienen cada estado asignado
    const conteoEstados = estados.map((estado) => ({
      id: estado.id,
      nombre: estado.nombre,
      cantidadTotal: ordenesDeTrabajo.filter(
        (orden) => orden.informe.estado && orden.informe.estado.id === estado.id
      ).length,
    }));

    res.json(conteoEstados);
  } catch (error) {
    console.error("Error al obtener el conteo de solicitudes:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener el conteo de solicitudes",
      error: error.message,
    });
  }
};

export const crearEstadosOrdenTrabajo = async (req, res) => {
  try {
    const { id, nombre } = req.body;

    if (id == null || nombre == null) {
      return res
        .status(400)
        .json({ message: "ID y nombre del estado son requeridos" });
    }

    const estadoExistente = await OrdenTrabajoEstados.findOne({ id });
    if (estadoExistente) {
      return res.status(400).json({ message: "ID del estado ya existe" });
    }

    const nuevoEstado = new OrdenTrabajoEstados({ id, nombre });
    await nuevoEstado.save();

    res.status(201).json({
      id: nuevoEstado.id,
      nombre: nuevoEstado.nombre,
      message: "Estado creado exitosamente",
    });
  } catch (error) {
    console.error("Error al crear el estado:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error al crear el estado", error: error.message });
    }
  }
};

export const actualizarEstadosOrdenTrabajo = async (req, res) => {
  try {
    const estadosActualizados = req.body;

    if (
      !Array.isArray(estadosActualizados) ||
      estadosActualizados.length !== 5
    ) {
      return res.status(400).json({
        message: "Se requiere un arreglo de 5 estados para actualizar",
      });
    }

    await Promise.all(
      estadosActualizados.map(({ id, nombre }) =>
        OrdenTrabajoEstados.updateOne({ id }, { nombre })
      )
    );

    res.status(200).json({ message: "Estados actualizados exitosamente" });
  } catch (error) {
    console.error(
      "Error al actualizar los estados de orden de trabajo:",
      error
    );
    res.status(500).json({
      message: "Error al actualizar los estados de orden de trabajo",
      error: error.message,
    });
  }
};
