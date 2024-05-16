import { Router } from "express";
import {crearSoli,editarSoli} from '../controllers/solicitud.controller.js'
const router = Router();

router.post("/solicitud", auth, crearSoli);

router.post("/suministro", auth, getTasks);

export default router;
