import { Router } from "express";
import { crearInforme,editarInforme,eliminarInforme,verInformePorId,verTodosInformes } from '../controllers/infor.js';

const router = Router();

router.get("/", verTodosInformes);
router.post("/", crearInforme);
router.put("/:id", eliminarProyecto);
router.get("/:id", verInformePorId);
router.delete("/:id", eliminarInforme);

export default router;
