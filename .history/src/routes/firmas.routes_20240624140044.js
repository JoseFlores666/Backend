import { Router } from "express";
import {auth} from '../middlewares/auth.middleware.js'
import {
  crearFirma,
  editarFirma,
  eliminarFirma,
  obtenerFirmaPorId,
  obtenerFirmas,
} from "../controllers/firmas.controller.js";

const router = Router();

router.get("/", auth, obtenerFirmas);
router.get("/actId/:id", auth, obtenerFirmaPorId);
router.post("/", auth, crearFirma);
router.put("/:id", auth, editarFirma);
router.delete("/:id", auth, eliminarFirma);

export default router;
