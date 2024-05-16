import { Router } from "express";
import from '../controllers/.controller'
const router = Router();

router.post("/solicitud", auth, getTasks);

router.post("/suministro", auth, getTasks);

export default router;
