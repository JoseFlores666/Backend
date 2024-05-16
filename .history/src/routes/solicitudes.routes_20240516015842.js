import { Router } from "express";
import {auth} from '../middlewares/auth.middleware.js'
import {crearUnaSolicitud,editarUnaSolicitud,eliminarUnaSolicitud,getTodasSolicitudes,verUnaSolicitudPorId} from '../controllers/solicitud.controller.js'

const router = Router();


router.get("/solicitud",getTodasSolicitudes);
router.get("/solicitud/:id",verUnaSolicitudPorId);
router.post("/solicitud",auth,crearUnaSolicitud);
router.delete("/solicitud/:id",auth,eliminarUnaSolicitud);
router.put("/solicitud/:id",auth,editarUnaSolicitud);

export default router;
