import { Router } from "express";
import {auth} from '../middlewares/auth.middleware.js'
import {crearUnaSolicitud,editarUnaSolicitud,eliminarUnaSolicitud,getTodasSolicitudes,verUnaSolicitudPorId,verSolicitudesPorEstado} from '../controllers/solicitud.controller.js'

const router = Router();


router.get("/",auth,getTodasSolicitudes);
router.get("/:id",verUnaSolicitudPorId);
router.get("/:id",verUnaSolicitudPorId);
router.post("/",crearUnaSolicitud);
router.delete("/eliminar/:id",eliminarUnaSolicitud);
router.put("/:id", editarUnaSolicitud);
router.get("/estado/:estado",verSolicitudesPorEstado);
router.get("/fecha/:fecha",verSolicitudesPorEstado);

export default router;