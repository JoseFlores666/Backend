import InformeTecnico from "../models/InformeTec.modal.js";

//importamos nuestras funciones personalizadas (crud) xd
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
      estado: "Sin asignar",
    });

    // console.log(req.files);

    const imagenes = [];

    if (req.files) {
      const fileKeys = Object.keys(req.files);

      for (const key of fileKeys) {
        const file = req.files[key];

        // console.log(file);

        const result = await uploadImage(file.tempFilePath || file.path);

        // Añade los datos de la imagen subida al array de imágenes
        imagenes.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });

        // Elimina el archivo temporal después de subirlo
        await fs.unlink(file.tempFilePath || file.path);
      }
    }

    nuevoInforme.informe.imagenes = imagenes;
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

    if (myInforme.informe.imagenes?.length > 0) {
      // Recorre todas las imágenes y elimínalas de Cloudinary
      for (const img of myInforme.informe.imagenes) {
        await deleteImage(img.public_id);
      }
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

export const llenadoDEPInforme = async (req, res) => {
  try {
    const { id } = req.params;
    const { fechaAtencion, items, obs } = req.body;

    const myinforme = await InformeTecnico.findById(id);
    if (!myinforme) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    myinforme.solicitud.fechaAtencion = fechaAtencion;

    myinforme.solicitud.insumosSolicitados = items.map((item) => ({
      cantidad: item.cantidad,
      descripcion: item.descripcion,
    }));

    myinforme.solicitud.Observacionestecnicas = obs;

    await myinforme.save();
    res.status(201).json();
  } catch (error) {
    console.error("Error con el informe técnico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
