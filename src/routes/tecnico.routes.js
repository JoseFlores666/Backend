import { Router } from "express";
// import { auth } from "../middlewares/auth.middleware";
import {
  verTodosLosTecnicos,
  crearPerfilTecnico,
} from "../controllers/tecnicos.controller.js";

const router = Router();

router.get("/", verTodosLosTecnicos);
router.post("/crearPerfilTecnico", crearPerfilTecnico);

export default router;
