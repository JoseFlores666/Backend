import { Router } from "express";
import {auth} from '../middlewares/auth.middleware.js'
import {
  crearInforme,
  editarInforme,
  eliminarInforme,
  verInformePorId,
  verTodosInformes,
} from "../controllers/infor.js";

const router = Router();

router.get("/", auth, verTodosInformes);
router.post("/", auth, crearInforme);
router.put("/:id", auth, editarInforme);
router.get("/:id", auth, verInformePorId);
router.delete("/:id", auth, eliminarInforme);

export default router;
