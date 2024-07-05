import InformeTecnico from "../models/InformeTecmodal.js";

//importamos nuestras funciones personalizadas (crud)
import { uploadImage, deleteImage } from "../util/cloudinary.js";
import fs from "fs-extra";

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

    const nuevoInforme = new InformeTecnico({
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
        descripcionDelServicio: descripcion,
      },
      firmas: "664d5e645db2ce15d4468548",
      user,
      estado: "Sin asignar",
    });

    if (req.files?.imagen) {
      const imagenes = [];
      console.log(req.files);
      const imagenArray = Array.isArray(req.files.imagen)
        ? req.files.imagen
        : [req.files.imagen];

      for (const file of imagenArray) {
        const result = await uploadImage(file.tempFilePath);
        imagenes.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });

        await fs.unlink(file.tempFilePath);
      }
     
      nuevoInforme.informe.imagenes = imagenes;
    }

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
    const myInforme = await InformeTecnico.findByIdAndDelete(req.params.id);

    if (!myInforme) {
      return res.status(404).json({ mensaje: "Informe técnico no encontrado" });
    }

    if (myInforme.informe.imagenes?.public_id) {
      //nustra funcion impotada para elimar archivos de cloudynary
      await deleteImage(myInforme.informe.imagen.public_id);
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
