import InformeTecnico from "../models/InformeTec.modal.js";

//importamos nuestras funciones personalizadas (crud) xd
import { uploadImage, deleteImage } from "../util/cloudinary.js";
import fs from "fs-extra";

export const verTodosInformes = async (req, res) => {
  try {
    const informes = await InformeTecnico.find();
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
      areasoli,
      solicita,
      edificio,
      fechaOrden,
      tipoMantenimiento,
      tipoTrabajo,
      tipoSolicitud,
      descripcion,
      user,
    } = req.body;

    const fecha = fechaOrden ? new Date(fechaOrden) : new Date();

    const nuevoInforme = new InformeTecnico({
      informe: {
        Solicita: {
          nombre: solicita,
          areaSolicitante: areasoli,
          edificio: edificio,
        },
        fecha: fecha || Date.now(),
        tipoDeMantenimiento: tipoMantenimiento,
        tipoDeTrabajo: tipoTrabajo,
        tipoDeSolicitud: tipoSolicitud,
        descripcionDelServicio: descripcion,
      },
      firmas: "664d5e645db2ce15d4468548",
      user,
      estado: "Recibida",
    });

    await nuevoInforme.save();

    res.status(201).json({
      mensaje: "Informe técnico creado correctamente",
    });
  } catch (error) {
    console.error("Error al crear informe técnico:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};
export const verInformePorId = async (req, res) => {
  try {
    const informe = await InformeTecnico.findById(req.params.id);
    if (!informe) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }
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
    const myInforme = await InformeTecnico.findByIdAndDelete(req.params.id);

    if (!myInforme) {
      return res.status(404).json({ message: "Informe técnico no encontrado" });
    }

    if (myInforme.informe.imagenes?.length > 0) {
      // Recorre todas las imágenes y elimínalas de Cloudinary
      for (const img of myInforme.informe.imagenes) {
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
    const { _id } = req.params;
    const informeModificado = await InformeTecnico.findByIdAndUpdate(
      _id,
      req.body,
      { new: true }
    );
    if (!informeModificado) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }
    res.status(200).json({
      mensaje: "Informe técnico modificado correctamente",
      informe: informeModificado,
    });
  } catch (error) {
    console.error("Error al modificar informe técnico:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};
export const llenadoDEPInforme = async (req, res) => {
  try {
    const { id } = req.params;
    const items = [];
    let index = 0;
    while (req.body[`items[${index}].cantidad`]) {
      items.push({
        cantidad: req.body[`items[${index}].cantidad`],
        descripcion: req.body[`items[${index}].descripcion`],
      });
      index++;
    }

    console.log("Request Body:", req.body);
    console.log("Items:", items);

    const myinforme = await InformeTecnico.findById(id);
    if (!myinforme) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    myinforme.solicitud.insumosSolicitados = items.map((item) => ({
      cantidad: item.cantidad,
      descripcion: item.descripcion,
    }));

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
      myinforme.informe.imagenes = [...myinforme.informe.imagenes, ...imagenes];
    }

    await myinforme.save();

    res
      .status(201)
      .json({ mensaje: "Datos del informe llenados correctamente" });
  } catch (error) {
    console.log("Error al asignar técnico:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const AsignarTecnicoInforme = async (req, res) => {
  try {
    const { id } = req.params;
    const { idTecnico } = req.body;

    console.log("ID del informe:", id);
    console.log("ID del técnico:", idTecnico);

    const Informe = await InformeTecnico.findById(id);
    if (!Informe) {
      return res.status(404).json({ mensaje: "Informe no encontrada" });
    }
    Informe.tecnicos = idTecnico;

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
      Informe.informe.imagenes = [...Informe.informe.imagenes, ...imagenes];
    }

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
    const estado = "Declinada";

    const informe = await InformeTecnico.findById(id);

    if (!informe) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }
    if (informe.estado === "Recibida") {
      informe.estado = estado;
      await informe.save();
      res
        .status(200)
        .json({ mensaje: "El informe ha sido declinado exitosamente" });
    } else {
      res.status(400).json({
        mensaje: "Error, el informe ya ha sido asignado a un técnico",
      });
    }
  } catch (error) {
    console.error("Error al actualizar el informe:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const verImagenesInformePorId = async (req, res) => {
  try {
    const informe = await InformeTecnico.findById(req.params.id).select(
      "informe.imagenes"
    );

    if (!informe) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }
    res.status(200).json(informe.informe.imagenes);
  } catch (error) {
    console.error("Error al obtener informe técnico por ID:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};
export const editarObservaciones = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(req.body);
    const { observaciones } = req.body;

    if (!observaciones) {
      return res.status(400).json({ mensaje: "Coloque una descripción" });
    }

    const informeEditado = await InformeTecnico.findById(id);
    if (!informeEditado) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }

    informeEditado.solicitud.Observacionestecnicas = observaciones;

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
      informeEditado.informe.imagenes = [
        ...informeEditado.informe.imagenes,
        ...imagenes,
      ];
    }

    await informeEditado.save();

    res.status(200).json({
      mensaje: "Observaciones agregadas correctamente",
    });
  } catch (error) {
    console.error("Error al editar observaciones:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};
