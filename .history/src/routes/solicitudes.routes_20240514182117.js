import { Router } from "express";
import from '../controllers/solicitud.controller'
const router = Router();

router.post("/solicitud", auth, getTasks);

router.post("/suministro", auth, getTasks);

export default router;
