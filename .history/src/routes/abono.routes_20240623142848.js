import { Router } from "express";
import { abonar } from '../controllers/abonos.controller.js';

const router = Router();

router.put("/:id", abonar);

export default router;
