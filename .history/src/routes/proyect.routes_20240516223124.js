import { Router } from "express";
import { crearProyecto,obtenerIdsYNombreProyectos,eliminarProyecto,obtenerProyectos,obtenerProyectoYActividades } from '../controllers/proyect.controller.js';

const router = Router();

router.get("/proyecto", obtenerProyectos);
router.get("/proyecto/ids", obtenerIdsYNombreProyectos);
router.get("/proyecto/:_id", obtenerProyectoYActividades);
router.post("/proyecto", crearProyecto);
router.delete("/proyecto/:_id", eliminarProyecto);

export default router;
