import { Router } from "express";
import { crearActividad, obtenerActividades, eliminarActividad } from '../controllers/act.controller.js';

const router = Router();

router.get("/", obtenerActividades);
router.post("/", crearActividad);
router.delete("/actividad/:id", eliminarActividad);

export default router;
