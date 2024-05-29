import { Router } from "express";
import { crearProyecto,obtenerIdsYNombreProyectos,eliminarProyecto,obtenerProyectos,obtenerProyectoYActividades,trae_Proyect_Act_Nombre } from '../controllers/proyect.controller.js';

const router = Router();

router.get("/", obtenerProyectos);

router.get("/ids", obtenerIdsYNombreProyectos);
router.get('/:id', obtenerProyectoYActividades);

router.post("/", crearProyecto);
router.delete("/:id", eliminarProyecto);

router.get('/nombre/:nombre', trae_Proyect_Act_Nombre); 
export default router;
