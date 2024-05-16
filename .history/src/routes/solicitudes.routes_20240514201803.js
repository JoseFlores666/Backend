import { Router } from "express";
import {crearSoli,editarSoli} from '../controllers/solicitud.controller.js'
const Solirouter = Router();

Solirouter.post("/solicitud", auth, crearSoli);

router.put("/solicitud", auth, editarSoli);

export default router;
