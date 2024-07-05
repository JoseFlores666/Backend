import { Router } from "express";
import multer from "multer";
import { convertirArchivo } from "../controllers/convertirPDF.controller.js";

const router = Router();

const upload = multer({ dest: "uploads/" }); // Directorio temporal para cargar archivos

// Ruta para manejar la carga y conversión de archivos
router.post("/upload", upload.single("file"), convertirArchivo);

export default router;