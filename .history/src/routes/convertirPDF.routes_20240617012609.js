import { Router } from "express";
import multer from "multer";
import { convertirArchivo } from "../controllers/convertirPDF.controller.js";

const router = Router();

// Configurar Multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Ruta para manejar la carga y conversión de archivos
router.post("/upload", upload.single("file"), convertirArchivo);

export default router;
