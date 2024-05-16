export const crearSoli = asy(req,res)=>{

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
export const editarSoli = (req,res)=>{}