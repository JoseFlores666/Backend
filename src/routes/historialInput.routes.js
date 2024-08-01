import { Router } from "express";
import { verTodosInformes,verTodasSoli } from "../controllers/historialInput.controller.js";
// import { auth } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", verTodosInformes);
router.get("/historialSoli", verTodasSoli);




export default router;
