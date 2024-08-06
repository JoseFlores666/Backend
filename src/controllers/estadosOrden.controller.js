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

export const filtrarInformesTotalEstados = async (req, res) => {
  try {
    const { mes, anio, idEstado } = req.query;
    let filtro = {};

    // Convertir parámetros a números si están definidos
    const mesNum = mes ? parseInt(mes, 10) : null;
    const anioNum = anio ? parseInt(anio, 10) : null;

    // Filtro de fecha
    if (mesNum !== null) {
      let fechaInicio, fechaFin;

      if (anioNum && !isNaN(anioNum)) {
        // Si se proporciona el año, filtrar por ese año y mes
        fechaInicio = new Date(anioNum, mesNum, 1);
        fechaFin = new Date(anioNum, mesNum + 1, 0); // Último día del mes
      } else {
        // Si no se proporciona el año, filtrar por cualquier año con ese mes
        filtro["$expr"] = {
          $and: [{ $eq: [{ $month: "$informe.fecha" }, mesNum + 1] }],
        };
      }

      if (anioNum && !isNaN(anioNum)) {
        filtro["informe.fecha"] = { $gte: fechaInicio, $lte: fechaFin };
      }
    }

    // Filtro de estado
    if (idEstado) {
      const estadoFiltrado = await OrdenTrabajoEstados.findOne({
        id: idEstado,
      });
      if (estadoFiltrado) {
        filtro["informe.estado"] = estadoFiltrado._id;
      } else {
        return res.status(400).json({ message: "Estado no encontrado" });
      }
    }

    // Obtener informes filtrados
    const informes = await InformeTecnico.find(filtro).populate(
      "informe.estado"
    );

    // Contar informes por estado
    const conteoEstados = {};
    informes.forEach((informe) => {
      const estadoId = informe.informe.estado._id.toString();
      conteoEstados[estadoId] = (conteoEstados[estadoId] || 0) + 1;
    });

    // Obtener todos los estados
    const todosLosEstados = await OrdenTrabajoEstados.find();

    // Crear un objeto con todos los estados y su conteo (incluyendo los que no tienen informes)
    const conteoPorEstado = todosLosEstados.map((estado) => ({
      id: estado.id,
      nombre: estado.nombre,
      cantidadTotal: conteoEstados[estado._id.toString()] || 0,
    }));

    res.status(200).json(conteoPorEstado);
  } catch (error) {
    console.error("Error al filtrar informes:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
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
      mensaje: "Estado creado exitosamente",
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

    res.status(200).json({ mensaje: "Estados actualizados exitosamente" });
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
