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
  eliminarImagenes,
  subirImagenes,
  actualizarInforme,
  eliminarImagenInforme,
} from "../controllers/infor.controller.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get("/", verTodosInformes);
router.post(
  "/llenadoDEPInforme/:id",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  llenadoDEPInforme
);
router.post("/", crearInforme);
router.post("/:id/imagenes", subirImagenes);

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
router.put("/actualizarInformes/:id", editarInforme);

router.get("/:id", verInformePorId);
router.get("/traerImagenes/:id", verImagenesInformePorId);
router.delete("/:id", auth, eliminarInforme);
router.delete("/eliminarUnaImagen/:id", eliminarImagenInforme);
export default router;
