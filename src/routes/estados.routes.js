import { Router } from "express";
import { verEstados,VercantidadTotal,crearEstados,actualizarEstados } from "../controllers/estados.controller.js";

const router = Router();

router.get("/", verEstados);
router.get("/VercantidadTotal", VercantidadTotal);
router.post("/crear", crearEstados);
router.put("/actualizar", actualizarEstados);

export default router;
