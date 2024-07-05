import { Router } from "express";
import { abonar } from '../controllers/.js';

const router = Router();

router.put("/:id", abonar);

export default router;
