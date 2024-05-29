import { Router } from "express";
import { crearProyecto,obtenerIdsYNombreProyectos,eliminarProyecto,obtenerProyectos,obtenerProyectoYActividades } from '../controllers/proyect.controller.js';

const router = Router();

router.get("/", obtenerProyectos);
router.get("/ids", obtenerIdsYNombreProyectos);
router.get('/:id', obtenerProyectoYActividades);
router.post("/", crearProyecto);
router.post("/:id/:id", getUnProyectAct);
router.delete("/:id", eliminarProyecto);

export default router;
