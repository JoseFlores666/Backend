import { Router } from "express";
import {
  verEstadosOrdenTrabajo,
  vercantidadTotalOrdenTrabajoEstados,
  crearEstadosOrdenTrabajo,
  actualizarEstadosOrdenTrabajo
} from "../controllers/estadosOrden.controller.js";

const router = Router();

router.get("/", verEstadosOrdenTrabajo);
router.get("/cantidadTotal", vercantidadTotalOrdenTrabajoEstados);
router.post("/crear", crearEstadosOrdenTrabajo);
router.put("/actualizar", actualizarEstadosOrdenTrabajo);

export default router;
