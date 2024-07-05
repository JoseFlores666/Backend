import { Router } from "express";
import { abonar } from '../controllers/infor.js';


const router = Router();

router.put("/:id", abonar);

export default router;
