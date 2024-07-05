import { Router } from "express";
// import {auth} from '../middlewares/auth.middleware.js'
import { crearFirma,editarFirma,eliminarFirma,obtenerFirmaPorId,obtenerFirmas} from '../controllers/firmas.controller.js';

const router = Router();

router.get("/", obtenerFirmas);
router.get("/actId/:id", obtenerFirmaPorId);
router.post("/", crearFirma);
router.put("/editarFirma, editarFirma);
router.delete("/:id", eliminarFirma);

export default router;
