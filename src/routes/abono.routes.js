import { Router } from "express";
import { abonarSolicitud } from '../controllers/abonos.controller.js';
// import {auth} from '../middlewares/auth.middleware.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import {abonarSchema} from '../schemas/abonos.schema.js'

const router = Router();

router.put("/:id",validateSchema(abonarSchema) ,abonarSolicitud);

export default router;
