import { Router } from "express";
// import {auth} from '../middlewares/auth.middleware.js'
import {} from '../controllers/solicitud.controller.js'
const router = Router();

router.get("/solicitud",verTodasSoli);
router.get("/solicitud/:id",verUnaSoliId);
router.post("/solicitud",crearUnaSoli);
router.delete("/solicitud/:id",eliminarUnaSoli);
router.put("/solicitud/:id",editarUnaSoli);

export default router;
