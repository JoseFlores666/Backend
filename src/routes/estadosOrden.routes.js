import { Router } from "express";
import {
  verEstadosOrdenTrabajo,
  filtrarInformesTotalEstados,
  crearEstadosOrdenTrabajo,
  actualizarEstadosOrdenTrabajo
} from "../controllers/estadosOrden.controller.js";

const router = Router();

router.get("/", verEstadosOrdenTrabajo);
router.get("/cantidadTotal", filtrarInformesTotalEstados);

router.post("/crear", crearEstadosOrdenTrabajo);
router.put("/actualizar", actualizarEstadosOrdenTrabajo);

export default router;
