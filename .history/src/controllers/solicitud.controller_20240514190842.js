export const crearSoli = async (req,res)=>{

    try {
        const { 
            informe,
            solicitud,
            firmas,
            estado
        } = req.body;    

        const nuevaSolicitud = new Solicitud({
            informe,
            solicitud,
            firmas,
            estado
        });

        await nuevaSolicitud.save();

        res.status(201).json({ mensaje: 'Solicitud agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
export const editarSoli = (req,res)=>
    try {
        const { _id } = req.params; 
        const { 
            informe,
            solicitud,
            firmas,
            estado
        } = req.body;    

        const solicitudModificada = await Solicitud.findByIdAndUpdate(_id, {
            informe,
            solicitud,
            firmas,
            estado
        }, { new: true });

        // Verificar si la solicitud fue encontrada y modificada correctamente
        if (!solicitudModificada) {
            return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        }

        // Si se modificó correctamente, devolver la solicitud modificada
        res.json({ mensaje: 'Solicitud modificada correctamente', solicitud: solicitudModificada });
    } catch (error) {
        console.error('Error al modificar solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

