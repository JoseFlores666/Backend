import { Router } from "express";
import { verHistorialSoli,verUnaHistorialSoli,eliminarUnHistorialSoli } from "../controllers/historialSoli.controller.js";
// import { auth } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", verHistorialSoli);
router.get("/verDeUnUsuario/:id", verUnaHistorialSoli);
router.delete("/eliminarUnHistorialSoli/:id", eliminarUnHistorialSoli);




export default router;
