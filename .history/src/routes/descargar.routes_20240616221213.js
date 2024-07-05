// routes/descargar.routes.js
import { Router } from "express";
import { descargarArchivo } from '../controllers/descargas.controller.js';

const router = Router();

router.get("/", descargarArchivo);
router.get("/externo", descargarArchivoExterno);

export default router;
