import Solicitud from "../models/solicitud.modal.js";

export const getTodasSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.find().populate('user').populate('suministros actividades');
        res.json(solicitudes);
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}; 

export const crearUnaSolicitud = async (req, res) => {
    try {
        const { 
            folio,
            suministro,
            pc,
            proyecto,
            actividad,
            cantidad,
            unidad,
            descripcion,
            justificacion,
            fecha, // Si este campo es importante, debes asegurarte de que esté presente en el formulario o en los datos que envías
            // Otros campos...
        } = req.body;

        const nuevaSolicitud = new Solicitud({
            folio,
            areaSolicitante: 'Administración y Finanzas Mantenimiento y Servicios Generales',
            fecha,
            tipoSuministro: suministro, 
            procesoClave: pc,
           
            suministros: [{ cantidad, unidadMedida: unidad, descripcion, cantidadEntregada: 0 }], // Guarda los suministros como un objeto en un array
            proyecto,
            actividades: actividad, 
            justificacionAdquisicion: justificacion,
            firmas: { solicitud: '', revision: '', validacion: '', autorizacion: '' }, // Ajusta esto si recibes datos para las firmas
            estado: 'Recibida'
        });

        // Guarda la nueva solicitud en la base de datos
        await nuevaSolicitud.save();

        res.status(201).json({ mensaje: 'Solicitud agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export const editarUnaSolicitud = async (req, res) => {
    try {
        const { _id } = req.params; 
        const { 
            areaSolicitante,
            fecha,
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
            fecha,
            tipoSuministro,
            procesoClave,
            area,
            suministros,
            proyecto,
            actividades,
            justificacionAdquisicion,
            firmas,
          
            estado
        }, { new: true }).populate('user').populate('suministros actividades');

        if (!solicitudModificada) {
            return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        }

        res.json({ mensaje: 'Solicitud modificada correctamente', solicitud: solicitudModificada });
    } catch (error) {
        console.error('Error al modificar solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
