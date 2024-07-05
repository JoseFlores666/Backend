import express from "express";
import {
  obtenerUltimoFolioCounterSoli,
  obtenerUltimoFolioCounterInforme,
} from "../controllers/folio.controller.js";
// import {auth} from '../middlewares/auth.middleware.js'

const router = express.Router();

router.get("/ultimo-folio-counter", obtenerUltimoFolioCounterSoli);
router.get("/ultimo-folio-counter-informe", obtenerUltimoFolioCounterInforme);

export default router;
