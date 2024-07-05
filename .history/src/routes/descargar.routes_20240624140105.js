// routes/descargar.routes.js
import { Router } from "express";
import {auth} from '../middlewares/auth.middleware.js'
import { descargarArchivo,descargarArchivoExterno } from '../controllers/descargas.controller.js';

const router = Router();

router.get("/",auth, descargarArchivo);
router.get("/externo", ,descargarArchivoExterno);

export default router;
