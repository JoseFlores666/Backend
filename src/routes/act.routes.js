import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  crearActividad,
  obtenerActividades,
  eliminarActividad,
  obtenerActividadesPorId,actualizarActividad
} from "../controllers/act.controller.js";

const router = Router();

router.get("/", auth, obtenerActividades);
router.get("/actId/:id", auth, obtenerActividadesPorId);
router.post("/", auth, crearActividad);
router.put("/actualizarAct/:id", auth, actualizarActividad);
router.delete("/:id", auth, eliminarActividad);

export default router;
