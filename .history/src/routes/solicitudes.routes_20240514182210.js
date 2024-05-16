import { Router } from "express";
import {crearSoli,editarSoli} from '../controllers/solicitud.controller.js'
const router = Router();

router.post("/solicitud", auth, crearSoli);

router.post("/solicitud", auth, getTasks);

export default router;
