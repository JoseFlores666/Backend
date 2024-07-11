import express from "express";
import {
  generateFormSolicitud,
  generateOrdenTrabajo,
} from "../controllers/.js";

const router = express.Router();

router.post("/form-solicitud", generateFormSolicitud);
router.post("/orden-trabajo", generateOrdenTrabajo);

export default router;
