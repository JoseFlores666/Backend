import { Router } from "express";
import { crearProyecto,obtenerIdsYNombreProyectos,eliminarProyecto,obtenerProyectos,obtenerIdsYNombreProyectos } from '../controllers/proyect.controller.js';

const router = Router();

router.get("/proyecto", obtenerProyectos);
router.get("/proyecto/ids", obtenerIdsYNombreProyectos);
router.get("/proyecto/ids", obtenerIdsYNombreProyectos);
router.post("/proyecto", crearProyecto);
router.delete("/proyecto/:id", eliminarProyecto);

export default router;
