import { Router } from "express";
import { crearFirma,editarFirma,eliminarFirma,obtenerFirmaPorId,obtenerFirmas} from '../controllers/firmas.controller.js';

const router = Router();

router.get("/", obtenerActividades);
router.get("/actId/:id", obtenerActividadesPorId);
router.post("/", crearFirma);
router.put("/:id", editarFirma);
router.delete("/:id", eliminarFirma);

export default router;
