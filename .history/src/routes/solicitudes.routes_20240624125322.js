import { Router } from "express";
import {auth} from '../middlewares/auth.middleware.js'
import {crearUnaSolicitud,editarUnaSolicitud,eliminarUnaSolicitud,getTodasSolicitudes,verUnaSolicitudPorId,verSolicitudesPorEstado} from '../controllers/solicitud.controller.js'

const router = Router();


router.get("/",auth,getTodasSolicitudes);
router.get("/:id",auth,verUnaSolicitudPorId);
router.get("/:id",auth,verUnaSolicitudPorId);
router.post("/",auth,crearUnaSolicitud);
router.delete("/eliminar/:id",auth,eliminarUnaSolicitud);
router.put("/:id",auth, editarUnaSolicitud);
router.get("/estado/:estado",verSolicitudesPorEstado);
router.get("/fecha/:fecha",verSolicitudesPorEstado);

export default router;