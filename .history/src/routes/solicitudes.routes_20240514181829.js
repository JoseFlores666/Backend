import { Router } from "express";

const router = Router();

router.post("/solicitud", auth, getTasks);

export default router;
