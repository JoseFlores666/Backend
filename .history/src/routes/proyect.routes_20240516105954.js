import { Router } from "express";
import { crearProyecto,eliminarProyecto,obtenerProyectos } from '../controllers/proyect.controller.js';

const router = Router();

router.get("/proyecto", obtenerProyectos);
router.post("/proyecto", crearProyecto);
router.put("/proyecto/:id", eliminarProyecto);
router.delete("/proyecto/:id", eliminarProyecto);

export default router;
