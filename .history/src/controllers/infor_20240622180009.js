import InformeTecnico from "../models/InformeTecmodal.js";

export const verTodosInformes = async (req, res) => {
  try {
    const informes = await InformeTecnico.find();
    res.json(informes);
  } catch (error) {
    console.error("Error al obtener informes técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const crearInforme = async (req, res) => {
  try {
    const {
      folio,
      areasoli,
      solicita,
      edificio,
      fechaOrden,
      tipoMantenimiento,
      tipoTrabajo,
      tipoSolicitud,
      desc,
      cantidad,
      descripcion,
      obs,
      imagen,
      user,
    } = req.body;

    const nuevoInforme = new InformeTecnico({
      folio,
      informe: {
        Solicita: {
          nombre: solicita,
          areaSolicitante: areasoli,
          edificio: edificio,
        },
        fecha: fechaOrden || Date.now(),
        tipoDeMantenimiento: tipoMantenimiento,
        tipoDeTrabajo: tipoTrabajo,
        tipoDeSolicitud: tipoSolicitud,
        descripcionDelServicio: desc,
      },
      solicitud: {
        insumosSolicitados: {
          fechaAtencion: fechaOrden,
          cantidad: cantidad,
          descripcion: descripcion,
          Observacionestecnicas: obs,
          imagen: imagen,
        },
      },
      firmas: "664d5e645db2ce15d4468548",
      user,
      estado: "Pendiente",
    });

    await nuevoInforme.save();
    res.status(201).json({ mensaje: "Informe técnico creado correctamente" });
  } catch (error) {
    console.error("Error al crear informe técnico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const verInformePorId = async (req, res) => {
  try {
    const informe = await InformeTecnico.findById(req.params.id);
    if (!informe) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }
    res.json(informe);
  } catch (error) {
    console.error("Error al obtener informe técnico por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarInforme = async (req, res) => {
  try {
    const informe = await InformeTecnico.findByIdAndDelete(req.params.id);
    if (!informe) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar informe técnico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarInforme = async (req, res) => {
  try {
    const { _id } = req.params;
    const informeModificado = await InformeTecnico.findByIdAndUpdate(
      _id,
      req.body,
      { new: true }
    );
    if (!informeModificado) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }
    res.json({
      mensaje: "Informe técnico modificado correctamente",
      informe: informeModificado,
    });
  } catch (error) {
    console.error("Error al modificar informe técnico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
