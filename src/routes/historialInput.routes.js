import { Router } from "express";
import { verTodosInformes,verTodasSoli,verTodasFirmas } from "../controllers/historialInput.controller.js";
// import { auth } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", verTodosInformes);
router.get("/historialSoli", verTodasSoli);
router.get("/historialNombreFirmas", verTodasFirmas);




export default router;
