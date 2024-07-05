import { Router } from "express";
import { editarApi_key, } from '../controllers/api_key.controller';

const router = Router();

router.get("/", obtenerFirmas);
router.put("/:id", editarFirma);

export default router;
