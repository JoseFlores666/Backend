import { Router } from "express";
// import { auth } from "../middlewares/auth.middleware";
import {
  verTodosLosTecnicos,
  crearPerfilTecnico,traeDescripcionTecnInforId
} from "../controllers/tecnicos.controller.js";

const router = Router();

router.get("/", verTodosLosTecnicos);
router.get("/Encabezado/:id", traeDescripcionTecnInforId);
router.post("/crearPerfilTecnico", crearPerfilTecnico);

export default router;
