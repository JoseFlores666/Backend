import { Router } from "express";
// import {auth} from '../middlewares/auth.middleware.js'
import { crearInforme,editarInforme,eliminarInforme,verInformePorId,verTodosInformes } from '../controllers/infor.js';

const router = Router();

router.get("/", auth,verTodosInformes);
router.post("/", ,crearInforme);
router.put("/:id", editarInforme);
router.get("/:id", verInformePorId);
router.delete("/:id", eliminarInforme);

export default router;
