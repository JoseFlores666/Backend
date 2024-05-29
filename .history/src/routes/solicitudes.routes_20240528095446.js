import { Router } from "express";
// import {auth} from '../middlewares/auth.middleware.js'
import {crearUnaSolicitud,editarUnaSolicitud,eliminarUnaSolicitud,getTodasSolicitudes,verUnaSolicitudPorId,verSolicitudesPorEstado} from '../controllers/solicitud.controller.js'

const router = Router();


router.get("/solicitud",getTodasSolicitudes);
router.get("/solicitud/:id",verUnaSolicitudPorId);
router.post("/solicitud",crearUnaSolicitud);
router.delete("/solicitud/:id",eliminarUnaSolicitud);
router.put("/solicitud/:id",editarUnaSolicitud);
router.get("/solicitud/estado/:estado",verSolicitudesPorEstado);

export default router;
