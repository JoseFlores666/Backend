import { Router } from "express";
import { verHistorialSoli,verUnaHistorialSoli } from "../controllers/historialSoli.controller.js";
// import { auth } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", verHistorialSoli);
router.get("/verDeUnUsuario/:id", verUnaHistorialSoli);




export default router;
