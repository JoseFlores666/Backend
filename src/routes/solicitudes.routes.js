import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { solicitudSchema } from "../schemas/registerSolicitud.js";
import {crearUnaSolicitud, editarUnaSolicitud, eliminarUnaSolicitud, getTodasSolicitudes, verUnaSolicitudPorId, verSolicitudesPorEstado,editarSolicitudFolioExterno,editarSolicitudEstado,} from "../controllers/solicitud.controller.js";


const router = Router();

router.get("/",getTodasSolicitudes);
router.get("/:id",verUnaSolicitudPorId);
router.post("/",  validateSchema(solicitudSchema),crearUnaSolicitud);
router.delete("/eliminar/:id", auth, eliminarUnaSolicitud);
router.put("/:id", auth, editarUnaSolicitud);
router.put("/folioExterno/:id", editarSolicitudFolioExterno);
router.put("/estado/:id",auth, editarSolicitudEstado);
router.get("/estado/:estado", auth, verSolicitudesPorEstado);

export default router;
