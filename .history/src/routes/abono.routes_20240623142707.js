import { Router } from "express";
import { a } from '../controllers/infor.js';

const router = Router();

router.put("/:id", editarInforme);

export default router;
