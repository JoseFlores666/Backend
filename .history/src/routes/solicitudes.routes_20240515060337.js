import { Router } from "express";
// import {auth} from '../middlewares/auth.middleware.js'
import {crearUnaSolicitud,editarUnaSolicitud,eliminarUnaSolicitud,getTodasSolicitudes,verUnaSolicitudPorId} from '../controllers/solicitud.controller.js'
const router = Router();

router.get("/solicitud",verTodasSoli);
router.get("/solicitud/:id",verUnaSoliId);
router.post("/solicitud",crearUnaSolicitud);
router.delete("/solicitud/:id",eliminarUnaSoli);
router.put("/solicitud/:id",editarUnaSolicitud);

export default router;
