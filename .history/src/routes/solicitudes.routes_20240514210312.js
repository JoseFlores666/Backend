import { Router } from "express";
import {auth} from '../middlewares/auth.middleware.js'
import {crearUnaSoli,editarUnaSoli,eliminarUnaSoli,verTodasSoli,verUnaSoliId} from '../controllers/solicitud.controller.js'
const router = Router();

router.get("/solicitud", auth,verTodasSoli);
router.get("/solicitud/:id", auth,verUnaSoliId);
router.post("/solicitud", auth,crearUnaSoli);
Solirouter.delete("/solicitud/:id", auth,eliminarUnaSoli);
Solirouter.put("/solicitud/:id", auth,editarUnaSoli);

export default Solirouter;
