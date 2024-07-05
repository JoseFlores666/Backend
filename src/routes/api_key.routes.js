import { Router } from "express";
import {
  editarApi_key,
  obtenerApi_key,
  crearApi_key,
} from "../controllers/api_key.controller.js";

const router = Router();

router.get("/", obtenerApi_key);
router.post("/crearApi_key/", crearApi_key);
router.put("/editarApi_key/:id", editarApi_key);

export default router;
