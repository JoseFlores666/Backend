import { Router } from "express";
import {crearSoli,editarSoli} from '../controllers/solicitud.controller.js'
const Solirouter = Router();

Solirouter.get("/solicitud", auth);

Solirouter.get("/solicitud/:id", auth);
Solirouter.put("/solicitud", auth);
Solirouter.put("/solicitud", auth, editarSoli);

export default Solirouter;
