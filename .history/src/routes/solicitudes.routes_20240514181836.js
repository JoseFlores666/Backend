import { Router } from "express";

const router = Router();

router.post("/solicitud", auth, getTasks);
router.post("/s", auth, getTasks);

export default router;
