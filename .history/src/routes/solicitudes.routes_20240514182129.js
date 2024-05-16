import { Router } from "express";
import c from '../controllers/solicitud.controller.js'
const router = Router();

router.post("/solicitud", auth, getTasks);

router.post("/suministro", auth, getTasks);

export default router;
