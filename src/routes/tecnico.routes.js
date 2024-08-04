import express from "express";
import {
  verTodosLosTecnicos,
  crearPerfilTecnico,
  obtenerTecnicoPorId,
  traeDescripcionTecnInforId,
  actualizarTecnico,
  eliminarTecnico,
} from "../controllers/tecnicos.controller.js";

const router = express.Router();

router.get("/", verTodosLosTecnicos);
router.post("/", crearPerfilTecnico);
router.get("/:id", obtenerTecnicoPorId);
router.put("/:id", actualizarTecnico);
router.delete("/:id", eliminarTecnico);
router.get("/:id/descripcion", traeDescripcionTecnInforId);

export default router;
