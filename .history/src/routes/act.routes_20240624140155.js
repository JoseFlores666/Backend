import { Router } from "express";
import {auth} from '../middlewares/auth.middleware.js'
import { crearActividad, obtenerActividades, eliminarActividad,obtenerActividadesPorId} from '../controllers/act.controller.js';

const router = Router();

router.get("/", obtenerActividades);
router.get("/actId/:id", obtenerActividadesPorId);
router.post("/", crearActividad);
router.delete("/:id", eliminarActividad);

export default router;
