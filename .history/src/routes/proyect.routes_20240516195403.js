import { Router } from "express";
import { crearProyecto,obtenerIDProyectos,eliminarProyecto,obtenerProyectos } from '../controllers/proyect.controller.js';

const router = Router();

router.get("/proyecto", obtenerProyectos);
router.get("/proyecto/id", obtenerIDProyectos);
router.post("/proyecto", crearProyecto);
router.delete("/proyecto/:id", eliminarProyecto);

export default router;
