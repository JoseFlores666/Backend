import { Router } from "express";
import {auth} from '../middlewares/auth.middleware.js'
import { crearProyecto,obtenerIdsYNombreProyectos,obtenerProyectoYActividad,eliminarProyecto,obtenerProyectos,obtenerProyectoYActividades } from '../controllers/proyect.controller.js';

const router = Router();

router.get("/",auth ,obtenerProyectos);
router.get("/ids", obtenerIdsYNombreProyectos);
router.get('/:id', obtenerProyectoYActividades);
router.post("/", crearProyecto);
router.get("/:proyectoId/actividad/:actividadId", obtenerProyectoYActividad);
router.delete("/:id", eliminarProyecto);

export default router;
