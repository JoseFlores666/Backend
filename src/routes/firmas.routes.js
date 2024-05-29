import { Router } from "express";
import { crearFirma,editarFirma,eliminarFirma,obtenerFirmaPorId,obtenerFirmas} from '../controllers/firmas.controller.js';

const router = Router();

router.get("/", obtenerFirmas);
router.get("/actId/:id", obtenerFirmaPorId);
router.post("/", crearFirma);
router.put("/:id", editarFirma);
router.delete("/:id", eliminarFirma);

export default router;
