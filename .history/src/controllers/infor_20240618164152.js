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
      fechaOrden, // Nombre del campo en el formulario: fechaOrden
      tipoMantenimiento,
      tipoTrabajo,
      tipoSolicitud,
      desc, // Nombre del campo en el formulario: desc
      cantidad,
      descripcion,
      obs, // Nombre del campo en el formulario: obs
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
        fecha: fechaOrden || Date.now(), // Utiliza fechaOrden para la fecha
        tipoDeMantenimiento: tipoMantenimiento,
        tipoDeTrabajo: tipoTrabajo,
        tipoDeSolicitud: tipoSolicitud,
        descripcionDelServicio: desc,
      },
      solicitud: {
        insumosSolicitados: {
          fechaAtencion: fechaOrden, // Utiliza fechaOrden para la fecha de atención
          cantidad: cantidad,
          descripcion: descripcion,
          Observacionestecnicas: obs,
        },
      },
      firmas: {
        solicitud: "", // Ajusta según tu lógica de firmas
        revision: "",
        validacion: "",
        autorizacion: "",
      },
      user, // Ajusta según cómo obtienes el usuario en tu backend
      estado: "Pendiente", // Puedes establecer un estado predeterminado si no se envía desde el formulario
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
