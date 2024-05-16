import { Router } from "express";
import { crearProyecto, obtenerProyectos, eliminarProyecto } from '../controllers/.js';

const router = Router();

router.get("/proyecto", obtenerProyectos);
router.post("/proyecto", crearProyecto);
router.delete("/proyecto/:id", eliminarProyecto);

export default router;
