import { Router } from "express";
import {crearSoli,editarSoli} from '../controllers/solicitud.controller.js'
const Solirouter = Router();

Solirouter.post("/solicitud", auth, crearSoli);

Solirouter.put("/solicitud", auth, editarSoli);

export default Solirouter;
