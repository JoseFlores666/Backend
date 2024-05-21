import { Router } from "express";
import { crearActividad, obtenerActividades, eliminarActividad,obtenerActividadesPorId} from '../controllers/act.controller.js';

const router = Router();

router.get("/", obtenerActividades);
router.get("/act", obtenerActividadesPorId);
router.post("/", crearActividad);
router.delete("/:id", eliminarActividad);

export default router;
