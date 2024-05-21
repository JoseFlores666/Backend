import InformeTecnico from "../models/InformeTecmodal.js";

export const verTodosInformes = async (req, res) => {
    try {
        const informes = await InformeTecnico.find();
        res.json(informes);
    } catch (error) {
        console.error('Error al obtener informes técnicos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}; 

import InformeTecnico from '../models/InformeTecnico';

export const crearInforme = async (req, res) => {
    try {
        const {
            folio,
            areaSolicitante,
            solicita,
            edificio,
            fecha,
            tipoMantenimiento,
            tipoTrabajo,
            tipoSolicitud,
            descripcionDelServicio,
            cantidad,
            descripcion,
            justificacion,
            observaciones,
            proyecto,
            estado,
            user
        } = req.body;

        // Crear el nuevo informe técnico con los datos proporcionados
        const nuevoInforme = new InformeTecnico({
            folio,
            informe: {
                Solicita: {
                    nombre: solicita,
                    areaSolicitante: areaSolicitante,
                    edificio: edificio,
                },
                fecha: fecha || Date.now(),
                tipoDeMantenimiento: tipoMantenimiento,
                tipoDeTrabajo: tipoTrabajo,
                tipoDeSolicitud: tipoSolicitud,
                descripcionDelServicio: descripcionDelServicio,
            },
            solicitud: {
                insumosSolicitados: {
                    fechaAtencion: fecha, // Asignar fecha correctamente
                    cantidad: cantidad,
                    descripcion: descripcion,
                    Observacionestecnicas: observaciones,
                }
            },
            firmas: {
                solicitud: justificacion, // Asignar justificación a solicitud en firmas
                revision: "", // Agrega los campos necesarios o dejarlos vacíos
                validacion: "",
                autorizacion: "",
            },
            user,
            estado: estado || 'Pendiente' // Valor por defecto para estado
        });

        await nuevoInforme.save();
        res.status(201).json({ mensaje: 'Informe técnico creado correctamente' });
    } catch (error) {
        console.error('Error al crear informe técnico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

};

export const verInformePorId = async (req, res) => {
    try {
        const informe = await InformeTecnico.findById(req.params.id);
        if (!informe) {
            return res.status(404).json({ mensaje: 'Informe técnico no encontrado' });
        }
        res.json(informe);
    } catch (error) {
        console.error('Error al obtener informe técnico por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminarInforme = async (req, res) => {
    try {
        const informe = await InformeTecnico.findByIdAndDelete(req.params.id);
        if (!informe) {
            return res.status(404).json({ mensaje: 'Informe técnico no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar informe técnico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const editarInforme = async (req, res) => {
    try {
        const { _id } = req.params; 
        const informeModificado = await InformeTecnico.findByIdAndUpdate(_id, req.body, { new: true });
        if (!informeModificado) {
            return res.status(404).json({ mensaje: 'Informe técnico no encontrado' });
        }
        res.json({ mensaje: 'Informe técnico modificado correctamente', informe: informeModificado });
    } catch (error) {
        console.error('Error al modificar informe técnico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
