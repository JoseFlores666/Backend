import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  crearProyecto,
  obtenerIdsYNombreProyectos,
  obtenerProyectoYActividad,
  eliminarProyecto,
  obtenerProyectos,
  obtenerProyectoYActividades,
  getActSinAsignar,
  asignarActividadProyec,
  ProyectCrearActYAsignarle,
  editarProyecto,
  desenlazarActividadProyec,
} from "../controllers/proyect.controller.js";

const router = Router();

router.get("/", auth, obtenerProyectos);
router.get("/getActSinAsignar", getActSinAsignar);
router.get("/ids", auth, obtenerIdsYNombreProyectos);
router.get("/:id", auth, obtenerProyectoYActividades);
router.get(
  "/:proyectoId/actividad/:actividadId",
  auth,
  obtenerProyectoYActividad
);
router.post("/", auth, crearProyecto);
router.post("/ProyectCrearActYAsignarle/:id", auth, ProyectCrearActYAsignarle);

router.put("/asignarActividadProyect/:id", auth, asignarActividadProyec);
router.put(
  "/editarProyecto/:id",
  auth,
  editarProyecto
);
router.put("/desenlazarActividadProyec/:id", auth, desenlazarActividadProyec);

router.delete("/:id", auth, eliminarProyecto);

export default router;
