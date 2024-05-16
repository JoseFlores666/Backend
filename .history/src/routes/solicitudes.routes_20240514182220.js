import { Router } from "express";
import {crearSoli,editarSoli} from '../controllers/solicitud.controller.js'
const router = Router();

router.post("/solicitud", auth, crearSoli);

router.put("/solicitud", auth, editarSoli);

export default router;
