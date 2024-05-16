import Solicitud from "../models/solicitud.modal.js";

export const verTodasSoli = async (req, res) => {
    try {
        const solicitudes = await Solicitud.find().populate('suministros proyecto actividades firmas');
        res.json(solicitudes);
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}; 

export const crearUnaSoli = async (req, res) => {
    try {
        const { 
            areaSolicitante,
            tipoSuministro,
            procesoClave,
            area,
            suministros,
            proyecto,
            actividades,
            justificacionAdquisicion,
            firmas,
            estado
        } = req.body;

        console.log(req.)
        const nuevaSolicitud = new Solicitud({
            areaSolicitante,
            tipoSuministro,
            procesoClave,
            area,
            suministros,
            proyecto,
            actividades,
            justificacionAdquisicion,
            firmas,
            user: req.user.id,
            estado
        });

        await nuevaSolicitud.save();

        res.status(201).json({ mensaje: 'Solicitud agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const verUnaSoliId = async (req, res) => {
    try {
        const mySoli = await Solicitud.findById(req.params.id).populate('suministros proyecto actividades firmas');
        if (!mySoli) {
            return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        }
        res.json(mySoli);
    } catch (error) {
        console.error('Error al obtener solicitud por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminarUnaSoli = async (req, res) => {
    try {
        const mySoli = await Solicitud.findByIdAndDelete(req.params.id);
        if (!mySoli) {
            return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const editarUnaSoli = async (req, res) => {
    try {
        const { _id } = req.params; 
        const { 
            areaSolicitante,
            tipoSuministro,
            procesoClave,
            area,
            suministros,
            proyecto,
            actividades,
            justificacionAdquisicion,
            firmas,
            estado
        } = req.body;

        const solicitudModificada = await Solicitud.findByIdAndUpdate(_id, {
            areaSolicitante,
            tipoSuministro,
            procesoClave,
            area,
            suministros,
            proyecto,
            actividades,
            justificacionAdquisicion,
            firmas,
            estado
        }, { new: true }).populate('suministros proyecto actividades firmas');

        if (!solicitudModificada) {
            return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        }

        res.json({ mensaje: 'Solicitud modificada correctamente', solicitud: solicitudModificada });
    } catch (error) {
        console.error('Error al modificar solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
