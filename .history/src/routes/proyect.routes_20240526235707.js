import { Router } from "express";
import { crearProyecto,obtenerIdsYNombreProyectos,eliminarProyecto,obtenerProyectos,obtenerUnProyecto,obtenerProyectoYActividades } from '../controllers/proyect.controller.js';

const router = Router();

router.get("/", obtenerProyectos);
router.get("/ids", obtenerIdsYNombreProyectos);
router.get('/:id', obtenerProyectoYActividades);
router.get('/:id', obtenerUnProyecto);
router.post("/", crearProyecto);
router.delete("/:id", eliminarProyecto);

export default router;
