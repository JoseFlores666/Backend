import { Router } from "express";
import
const router = Router();

router.post("/solicitud", auth, getTasks);

router.post("/suministro", auth, getTasks);

export default router;
