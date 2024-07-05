import { Router } from "express";
import {auth} from '../middlewares/auth.middleware.js'
import { crearProyecto,obtenerIdsYNombreProyectos,obtenerProyectoYActividad,eliminarProyecto,obtenerProyectos,obtenerProyectoYActividades } from '../controllers/proyect.controller.js';

const router = Router();

router.get("/",auth ,obtenerProyectos);
router.get("/ids",auth, obtenerIdsYNombreProyectos);
router.get('/:id', auth,obtenerProyectoYActividades);
router.post("/", auth,crearProyecto);
router.get("/:proyectoId/actividad/:actividadId", auth,obtenerProyectoYActividad);
router.delete("/:id",, eliminarProyecto);

export default router;
