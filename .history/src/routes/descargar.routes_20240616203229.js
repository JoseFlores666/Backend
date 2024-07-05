// routes/descargar.routes.js
import { Router } from "express";
import { descargarArchivo } from '../controllers/.js';

const router = Router();

router.get("/", descargarArchivo);

export default router;
