import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  crearInforme,
  editarInforme,
  eliminarInforme,
  verInformePorId,
  verTodosInformes,
  llenadoDEPInforme,
  AsignarTecnicoInforme,
  editarEstadoDelInforme,
  verImagenesInformePorId,
  editarObservaciones,
} from "../controllers/infor.controller.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get("/", auth, verTodosInformes);
router.post("/llenadoDEPInforme/:id", llenadoDEPInforme);
router.post("/", crearInforme);

router.put("/:id", auth, editarInforme);
router.put(
  "/AsignarTecnico/:id",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  AsignarTecnicoInforme
);
router.put("/editarEstadoInforme/:id", editarEstadoDelInforme);
router.put(
  "/editarObservaciones/:id",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  editarObservaciones
);
router.get("/:id", verInformePorId);
router.get("/traerImagenes/:id", verImagenesInformePorId);
router.delete("/:id", auth, eliminarInforme);

export default router;
