import { Router } from "express";
import { abonarSolicitud } from '../controllers/abonos.controller.js';

const router = Router();

router.get("/", obtenerFirmas);
router.put("/:id", editarFirma);
export default router;
