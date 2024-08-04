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
  capturarDiagnostico,
} from "../controllers/infor.controller.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get("/", auth, verTodosInformes);
router.post(
  "/llenadoDEPInforme/:id",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  llenadoDEPInforme
);
router.post("/", crearInforme);

router.put("/:id", auth, editarInforme);
router.put("/AsignarTecnico/:id", AsignarTecnicoInforme);
router.put("/editarEstadoInforme/:id", editarEstadoDelInforme);
router.put(
  "/capturarDiagnostico/:id",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  capturarDiagnostico
);
router.get("/:id", verInformePorId);
router.get("/traerImagenes/:id", verImagenesInformePorId);
router.delete("/:id", auth, eliminarInforme);

export default router;
