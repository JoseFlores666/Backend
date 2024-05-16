import { Router } from "express";
import crearSoli,editarSoli{} from '../controllers/solicitud.controller.js'
const router = Router();

router.post("/solicitud", auth, getTasks);

router.post("/suministro", auth, getTasks);

export default router;
