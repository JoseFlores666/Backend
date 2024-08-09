import InformeTecnico from "../models/InformeTec.modal.js";
import OrdenTrabajoEstados from "../models/estadosOrden.model.js";

//importamos nuestras funciones personalizadas (crud) xd
import { uploadImage, deleteImage } from "../util/cloudinary.js";
import fs from "fs-extra";

export const verTodosInformes = async (req, res) => {
  try {
    const informes = await InformeTecnico.find()
      .populate("informe.user")
      .populate("informe.estado")
      .populate("informe.solicitud.tecnicos")
      .populate("informe.firmas");

    const estadoActualizado = OrdenTrabajoEstados.findById(1)

    informes.forEach((informe) => {
      if (informe.estado && !informe.solicitud.tecnicos) {
        informe.estado = estadoActualizado;
      }
    });

    res.status(200).json(informes);
  } catch (error) {
    console.error("Error al obtener informes técnicos:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const crearInforme = async (req, res) => {
  try {
    const {
      Solicita,
      fecha,
      tipoDeMantenimiento,
      tipoDeTrabajo,
      tipoDeSolicitud,
      descripcion,
      user,
    } = req.body;

    const estadoRecibido = await OrdenTrabajoEstados.findOne({ id: 1 });

    const nuevoInforme = new InformeTecnico({
      informe: {
        Solicita,
        fecha: new Date(fecha),
        tipoDeMantenimiento,
        tipoDeTrabajo: tipoDeTrabajo,
        tipoDeSolicitud,
        descripcion,
        firmas: "664d5e645db2ce15d4468548",
        user,
        estado: estadoRecibido._id,
      },
    });

    await nuevoInforme.save();
    res.status(201).json({ mensaje: "Informe técnico creado correctamente" });
  } catch (error) {
    console.error("Error al crear informe técnico:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const verInformePorId = async (req, res) => {
  try {
    const informe = await InformeTecnico.findById(req.params.id)
      .populate("informe.user")
      .populate("informe.estado")
      .populate("informe.solicitud.tecnicos")
      .populate("informe.solicitud.material")
      .populate("informe.firmas");
    if (!informe)
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    res.status(200).json(informe);
  } catch (error) {
    console.error("Error al obtener informe técnico por ID:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const eliminarInforme = async (req, res) => {
  try {
    const informe = await InformeTecnico.findByIdAndDelete(req.params.id);

    if (!informe)
      return res.status(404).json({ message: "Informe técnico no encontrado" });

    if (informe.informe.solicitud.imagenes.length > 0) {
      for (const img of informe.informe.solicitud.imagenes) {
        try {
          await deleteImage(img.public_id);
        } catch (err) {
          console.error("Error al eliminar la imagen de Cloudinary:", err);
        }
      }
    }

    res.status(200).json({ mensaje: "Informe técnico eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar informe técnico:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const editarInforme = async (req, res) => {
  try {
    const { id } = req.params;
    const { Solicita, fecha, tipoDeMantenimiento, tipoDeTrabajo, tipoDeSolicitud, descripcion, solicitud } = req.body;

    console.log(req.body)

    // Buscar el informe técnico por su ID
    const informe = await InformeTecnico.findById(id)
      .populate("informe.estado")
      .populate("informe.solicitud.tecnicos")
      .populate("informe.firmas");

    // Si el informe no existe, devolver un error 404
    if (!informe) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }

    // Actualizar los campos proporcionados
    informe.informe.Solicita = Solicita || informe.informe.Solicita;
    informe.informe.fecha = fecha ? new Date(fecha) : informe.informe.fecha;
    informe.informe.tipoDeMantenimiento = tipoDeMantenimiento || informe.informe.tipoDeMantenimiento;
    informe.informe.tipoDeTrabajo = tipoDeTrabajo || informe.informe.tipoDeTrabajo;
    informe.informe.tipoDeSolicitud = tipoDeSolicitud || informe.informe.tipoDeSolicitud;
    informe.informe.descripcion = descripcion || informe.informe.descripcion;



    // Si se proporciona una solicitud, actualizar los campos relevantes
    if (solicitud) {
      informe.informe.solicitud.fechaAtencion = solicitud.fechaAtencion || informe.informe.solicitud.fechaAtencion;
      informe.informe.solicitud.tecnicos = solicitud.tecnicos || informe.informe.solicitud.tecnicos;
      informe.informe.solicitud.diagnostico = solicitud.diagnostico || informe.informe.solicitud.diagnostico;

      // Si se proporciona material, actualizarlo
      if (solicitud.material) {
        informe.informe.solicitud.material = solicitud.material;
      }
    }

    await informe.save();
    res.status(200).json({ mensaje: "Informe técnico actualizado correctamente", informe });
  } catch (error) {
    console.error("Error al actualizar el informe técnico:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};


export const llenadoDEPInforme = async (req, res) => {
  try {
    const { id } = req.params;
    const items = [];

    for (let i = 0; req.body[`items[${i}].cantidad`]; i++) {
      items.push({
        cantidad: req.body[`items[${i}].cantidad`],
        descripcion: req.body[`items[${i}].descripcion`],
      });
    }

    const informe = await InformeTecnico.findById(id);
    if (!informe)
      return res.status(404).json({ mensaje: "Informe no encontrado" });

    informe.informe.solicitud.material = items;

    if (informe.informe.solicitud.material !== null) {
      const estadoAsignado = await OrdenTrabajoEstados.findOne({ id: 4 });

      if (!estadoAsignado) {
        return res.status(404).json({ mensaje: "Estado no encontrado" });
      }
      informe.informe.estado = estadoAsignado._id;
    }

    const imagenes = [];
    if (req.files) {
      const fileKeys = Object.keys(req.files);

      for (const key of fileKeys) {
        const file = req.files[key];

        try {
          const result = await uploadImage(file.tempFilePath || file.path);
          imagenes.push({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
          await fs.unlink(file.tempFilePath || file.path);
        } catch (error) {
          console.error("Error al procesar la imagen:", error);
          return res.status(500).json({ error: "Error al procesar la imagen" });
        }
      }
    }

    if (imagenes.length > 0) {
      informe.informe.solicitud.imagenes = [
        ...informe.informe.solicitud.imagenes,
        ...imagenes,
      ];
    }

    await informe.save();
    res
      .status(201)
      .json({ mensaje: "Datos del informe llenados correctamente" });
  } catch (error) {
    console.error("Error al llenar datos del informe:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const AsignarTecnicoInforme = async (req, res) => {
  try {
    const { id } = req.params;
    const { idTecnico } = req.body;

    const Informe = await InformeTecnico.findById(id);
    if (!Informe) {
      return res.status(404).json({ mensaje: "Informe no encontrada" });
    }
    Informe.informe.solicitud.fechaAtencion = new Date();
    Informe.informe.solicitud.tecnicos = idTecnico;

    const estadoAsignado = await OrdenTrabajoEstados.findOne({ id: 2 });
    if (!estadoAsignado) {
      return res.status(404).json({ mensaje: "Estado asignado no encontrado" });
    }
    Informe.informe.estado = estadoAsignado._id;
    await Informe.save();
    res.json({ mensaje: "Técnico asignado con exito" });
  } catch (error) {
    console.log("error al consultar al crear el perfil del tecnico");
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarEstadoDelInforme = async (req, res) => {
  try {
    const { id } = req.params;

    const { diagnostico, accion } = req.body;

    if (!diagnostico) {
      return res.status(400).json({ mensaje: "Capture su diagnostico" });
    }

    const informeEditado = await InformeTecnico.findById(id);
    if (!informeEditado) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }

    const imagenes = [];
    if (req.files) {
      const fileKeys = Object.keys(req.files);

      for (const key of fileKeys) {
        const file = req.files[key];

        try {
          // Subir la imagen y obtener los datos de la imagen subida
          const result = await uploadImage(file.tempFilePath || file.path);

          imagenes.push({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });

          // Elimina el archivo temporal después de subirlo
          await fs.unlink(file.tempFilePath || file.path);
        } catch (error) {
          console.error("Error al procesar la imagen:", error);
          return res.status(500).json({ error: "Error al procesar la imagen" });
        }
      }
    }

    if (imagenes.length > 0) {
      informeEditado.informe.solicitud.imagenes = [
        ...informeEditado.informe.solicitud.imagenes,
        ...imagenes,
      ];
    }
    const estadoAsignado = OrdenTrabajoEstados.findOne({ id: 2 });
    const estadoDeclinado = OrdenTrabajoEstados.findOne({ id: 5 });
    const estadoDiagnosticado = OrdenTrabajoEstados.findOne({ id: 3 });

    informeEditado.informe.solicitud.diagnostico = diagnostico;

    if (accion === "declinar") {
      if (informeEditado.informe.estado.equals(estadoAsignado._id)) {
        informeEditado.informe.estado = estadoDeclinado._id;
        const estadoAsignado = await OrdenTrabajoEstados.find({ id: 5 });
        informeEditado.informe.estado = estadoAsignado._id;

        await informeEditado.save();
        return res
          .status(200)
          .json({ mensaje: "El informe ha sido declinado exitosamente" });
      }
    } else {
      informeEditado.informe.estado = estadoDiagnosticado._id;
      await informeEditado.save();
      return res
        .status(200)
        .json({ mensaje: "Informe diagnosticado exitosamente" });
    }
  } catch (error) {
    console.error("Error al capturar su diagnostico:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const verImagenesInformePorId = async (req, res) => {
  try {
    const informe = await InformeTecnico.findById(req.params.id).select(
      "informe.solicitud.imagenes"
    );
    if (!informe)
      return res.status(404).json({ mensaje: "Informe no encontrado" });
    res.status(200).json(informe.informe.solicitud.imagenes);
  } catch (error) {
    console.error("Error al obtener imágenes del informe:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};
export const capturarDiagnostico = async (req, res) => {
  try {
    const { id } = req.params;

    const { diagnostico, accion } = req.body;

    if (!diagnostico) {
      return res.status(400).json({ mensaje: "Capture su diagnostico" });
    }

    const informeEditado = await InformeTecnico.findById(id);
    if (!informeEditado) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }

    const imagenes = [];
    if (req.files) {
      const fileKeys = Object.keys(req.files);

      for (const key of fileKeys) {
        const file = req.files[key];

        try {
          // Subir la imagen y obtener los datos de la imagen subida
          const result = await uploadImage(file.tempFilePath || file.path);

          imagenes.push({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });

          // Elimina el archivo temporal después de subirlo
          await fs.unlink(file.tempFilePath || file.path);
        } catch (error) {
          console.error("Error al procesar la imagen:", error);
          return res.status(500).json({ error: "Error al procesar la imagen" });
        }
      }
    }

    if (imagenes.length > 0) {
      informeEditado.informe.solicitud.imagenes = [
        ...informeEditado.informe.solicitud.imagenes,
        ...imagenes,
      ];
    }
    const estadoAsignado = await OrdenTrabajoEstados.findOne({ id: 2 });
    const estadoDiagnosticado = await OrdenTrabajoEstados.findOne({ id: 3 });
    const estadoDeclinado = await OrdenTrabajoEstados.findOne({ id: 5 });

    informeEditado.informe.solicitud.diagnostico = diagnostico;

    if (accion === "declinar") {
      if (informeEditado.informe.estado.equals(estadoAsignado._id)) {
        informeEditado.informe.estado = estadoDeclinado._id;
        await informeEditado.save();
        return res
          .status(200)
          .json({ mensaje: "El informe ha sido declinado exitosamente" });
      } else {
        return res.status(400).json({
          mensaje: "Error, el informe ya ha sido asignado a un técnico",
        });
      }
    } else {
      informeEditado.informe.estado = estadoDiagnosticado._id;
      await informeEditado.save();
      return res
        .status(200)
        .json({ mensaje: "Informe diagnosticado exitosamente" });
    }
  } catch (error) {
    console.error("Error al capturar su diagnostico:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const actualizarInforme = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Solicita,
      fecha,
      tipoDeMantenimiento,
      tipoDeTrabajo,
      tipoDeSolicitud,
      descripcion,
      user,
      estado,
      solicitud,
    } = req.body;

    // Verifica si el informe existe
    const informe = await InformeTecnico.findById(id);
    if (!informe) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }

    // Actualiza los campos básicos del informe
    informe.informe.Solicita = Solicita || informe.informe.Solicita;
    informe.informe.fecha = fecha ? new Date(fecha) : informe.informe.fecha;
    informe.informe.tipoDeMantenimiento =
      tipoDeMantenimiento || informe.informe.tipoDeMantenimiento;
    informe.informe.tipoDeTrabajo =
      tipoDeTrabajo || informe.informe.tipoDeTrabajo;
    informe.informe.tipoDeSolicitud =
      tipoDeSolicitud || informe.informe.tipoDeSolicitud;
    informe.informe.descripcion = descripcion || informe.informe.descripcion;
    informe.informe.user = user || informe.informe.user;

    // Actualiza el estado
    if (estado) {
      const estadoActualizado = await OrdenTrabajoEstados.findOne({
        id: estado,
      });
      if (estadoActualizado) {
        informe.informe.estado = estadoActualizado._id;
      } else {
        return res.status(400).json({ mensaje: "Estado no encontrado" });
      }
    }

    // Actualiza la solicitud si se proporciona
    if (solicitud) {
      informe.informe.solicitud.fechaAtencion =
        solicitud.fechaAtencion || informe.informe.solicitud.fechaAtencion;
      informe.informe.solicitud.tecnicos =
        solicitud.tecnicos || informe.informe.solicitud.tecnicos;
      informe.informe.solicitud.diagnostico =
        solicitud.diagnostico || informe.informe.solicitud.diagnostico;

      // Maneja el material si se proporciona
      if (solicitud.material) {
        informe.informe.solicitud.material = solicitud.material;
      }
    }

    // Guarda los cambios en la base de datos
    await informe.save();
    res
      .status(200)
      .json({ mensaje: "Informe técnico actualizado correctamente", informe });
  } catch (error) {
    console.error("Error al actualizar el informe técnico:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const eliminarImagenes = async (req, res) => {
  try {
    const { id } = req.params;
    const { imagenesParaEliminar } = req.body;

    // Verifica si se proporcionan imágenes para eliminar
    if (!imagenesParaEliminar || !Array.isArray(imagenesParaEliminar)) {
      return res
        .status(400)
        .json({ mensaje: "No se proporcionaron imágenes para eliminar" });
    }

    // Busca el informe técnico por ID
    const informe = await InformeTecnico.findById(id);
    if (!informe) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }

    // Elimina las imágenes de Cloudinary
    for (const imagen of imagenesParaEliminar) {
      try {
        await deleteImage(imagen.public_id);
      } catch (error) {
        console.error("Error al eliminar la imagen de Cloudinary:", error);
        return res
          .status(500)
          .json({ mensaje: "Error al eliminar una de las imágenes" });
      }
    }

    // Actualiza el informe técnico para remover las imágenes eliminadas
    informe.informe.solicitud.imagenes =
      informe.informe.solicitud.imagenes.filter(
        (img) =>
          !imagenesParaEliminar.some(
            (elimImg) => elimImg.public_id === img.public_id
          )
      );

    // Guarda los cambios en la base de datos
    await informe.save();
    res.status(200).json({ mensaje: "Imágenes eliminadas correctamente" });
  } catch (error) {
    console.error("Error al eliminar imágenes del informe técnico:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};
export const subirImagenes = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica si se han proporcionado archivos en la solicitud
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ mensaje: "No se proporcionaron imágenes para subir" });
    }

    // Busca el informe técnico por ID
    const informe = await InformeTecnico.findById(id);
    if (!informe) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }

    const imagenes = [];
    const fileKeys = Object.keys(req.files);

    // Procesa y sube cada archivo
    for (const key of fileKeys) {
      const file = req.files[key];
      try {
        const result = await uploadImage(file.tempFilePath || file.path);
        imagenes.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
        await fs.unlink(file.tempFilePath || file.path); // Elimina el archivo temporal después de subirlo
      } catch (error) {
        console.error("Error al procesar la imagen:", error);
        return res
          .status(500)
          .json({ mensaje: "Error al procesar una de las imágenes" });
      }
    }

    // Actualiza el informe técnico con las nuevas imágenes
    informe.informe.solicitud.imagenes = [
      ...informe.informe.solicitud.imagenes,
      ...imagenes,
    ];

    // Guarda los cambios en la base de datos
    await informe.save();
    res
      .status(200)
      .json({ mensaje: "Imágenes subidas correctamente", imagenes });
  } catch (error) {
    console.error("Error al subir imágenes al informe técnico:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};
