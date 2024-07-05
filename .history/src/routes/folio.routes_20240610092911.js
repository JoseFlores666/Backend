import express from 'express';
import { obtenerUltimoFolioCounter } from '../controllers/folio.controller.js';

const router = express.Router();

router.get('/ultimo-folio-counter', obtenerUltimoFolioCounter);

export default router;
