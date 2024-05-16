import { Router } from "express";
import {crearUnaSoli,editarUnaSoli,eliminarUnaSoli,verTodasSoli,verUnaSoliId} from '../controllers/solicitud.controller.js'
const Solirouter = Router();

Solirouter.get("/solicitud", auth,verUnaSoliId);
Solirouter.get("/solicitud/:id", auth);
Solirouter.post("/solicitud", auth);
Solirouter.delete("/solicitud/:id", auth);
Solirouter.put("/solicitud/:id", auth);

export default Solirouter;
