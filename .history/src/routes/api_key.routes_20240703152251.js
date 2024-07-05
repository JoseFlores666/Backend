import { Router } from "express";
import { editarApi_key,obtenerApi_key } from '../controllers/api_key.controller';

const router = Router();

router.get("/", obtenerApi_key);
router.put("/:id", editarFirma);

export default router;
