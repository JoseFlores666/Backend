import { Router } from 'express';
import { generateFormSolicitud, generateOrdenTrabajo } from '../controllers/document.controller.js';

const router = Router();

router.post('/generate-formSolicitud', generateFormSolicitud);
router.post('/generate-ordenTrabajo', generateOrdenTrabajo);

export default router;
