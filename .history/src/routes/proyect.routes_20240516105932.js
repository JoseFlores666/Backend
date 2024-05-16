import { Router } from "express";
import { crearProyecto,eliminarProyecto,obtenerProyectos } from '../controllers/proyect.controller.js';

const router = Router();

router.get("/proyecto", verTodosInformes);
router.post("/proyecto", crearProyecto);
router.put("/proyecto/:id", eliminarProyecto);
router.get("/proyecto/:id", verInformePorId);
router.delete("/proyecto/:id", eliminarInforme);

export default router;
