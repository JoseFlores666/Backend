import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  crearInforme,
  editarInforme,
  eliminarInforme,
  verInformePorId,
  verTodosInformes,
  llenadoDEPInforme,
} from "../controllers/infor.controller.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get("/", auth, verTodosInformes);
router.post("/llenadoDEPInforme/:id", llenadoDEPInforme);
router.post(
  "/",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  crearInforme
);

router.put("/:id", auth, editarInforme);
router.get("/:id", verInformePorId);
router.delete("/:id", auth, eliminarInforme);

export default router;
