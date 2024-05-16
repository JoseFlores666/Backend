import { Router } from "express";
import { crearInforme,editarInforme,eliminarInforme,verInformePorId,verTodosInformes } from '../controllers/infor.js';

const router = Router();

router.get("/", verTodosInformes);
router.post("/", crearInforme);
router.put("/proyecto/:id", eliminarProyecto);
router.get("/proyecto/:id", verInformePorId);
router.delete("/proyecto/:id", eliminarInforme);

export default router;
