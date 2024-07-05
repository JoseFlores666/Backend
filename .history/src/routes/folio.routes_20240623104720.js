import express from 'express';
import { obtenerUltimoFolioCounterSoli } from '../controllers/folio.controller.js';

const router = express.Router();

router.get('/ultimo-folio-counter', obtenerUltimoFolioCounterSoli);

export default router;
