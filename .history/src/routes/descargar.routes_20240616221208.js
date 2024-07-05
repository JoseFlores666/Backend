// routes/descargar.routes.js
import { Router } from "express";
import { descargarArchivo } from '../controllers/descargas.controller.js';

const router = Router();

router.get("/", descargarArchivo);
router.get("/", descargarArchivo);

export default router;
