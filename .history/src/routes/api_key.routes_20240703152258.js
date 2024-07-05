import { Router } from "express";
import { editarApi_key,obtenerApi_key } from '../controllers/api_key.controller.js';

const router = Router();

router.get("/", obtenerApi_key);
router.put("/:id", editarApi_key);

export default router;
