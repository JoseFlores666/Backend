import { Router } from "express";
import { crearActividad, obtenerActividades, eliminarActividad } from '../controllers/act.controller.js';

const router = Router();

router.get("/", obtenerActividades);
router.get("/", obtenerActividadesPorId);
router.post("/", crearActividad);
router.delete("/:id", eliminarActividad);

export default router;
