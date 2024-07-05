import { Router } from "express";
import {  } from '../controllers/.js';

const router = Router();

router.get("/", obtenerFirmas);
router.put("/:id", editarFirma);

export default router;
