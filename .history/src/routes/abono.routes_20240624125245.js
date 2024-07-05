import { Router } from "express";
import { abonarSolicitud } from '../controllers/abonos.controller.js';
// import {auth} from '../middlewares/auth.middleware.js'
const router = Router();

router.put("/:id", abonarSolicitud);

export default router;
