import { Router } from "express";
import { abonarSolicitud } from '../controllers/abonos.controller.js';

const router = Router();

router.put("/:id", abonar);

export default router;
