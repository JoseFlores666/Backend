import  Solicitud  from "../models/solicitud.modal.js";


export const verTodasSoli = async (req,res)=>{
    const solicitudes = await Solicitud.find()
    res.json(solicitudes);
}
export const crearUnaSoli = async (req,res)=>{

    try {
        const nuevaSolicitud = new Solicitud(datosSolicitud);
        await nuevaSolicitud.save();
        console.log('Solicitud guardada exitosamente');
      } catch (error) {
        console.error('Error al guardar la solicitud:', error);
      }
}
export const verUnaSoliId = async (req,res)=>{}
export const editarUnaSoli = async (req,res)=>{
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
export const eliminarUnaSoli = async (req,res)=>{}
