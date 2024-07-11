import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload');

import authRoutes from "./routes/auth.routes.js";
import solirouter from "./routes/solicitudes.routes.js";
import abonorouter from "./routes/abono.routes.js";
import inforouter from "./routes/infor.routes.js";
import proyectrouter from "./routes/proyect.routes.js";
import actrouter from "./routes/act.routes.js";
import foliorouter from "./routes/folio.routes.js";
import firmasrouter from "./routes/firmas.routes.js";
import api_keyrouter from "./routes/api_key.routes.js";
import documentRoutes from "./routes/document.routes.js"; // Nueva ruta
import historialInput from "./routes/historialInput.routes.js";
import bodyParser from "body-parser";
import { FRONTEND_URL } from "./config.js";

const app = express();

app.use(
  cors({
    credentials: true, //Para que se pueda restablecer las cookies
    origin: FRONTEND_URL,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cookieParser());

app.use("/api/solicitud", solirouter);
app.use("/api/abono", abonorouter);
app.use("/api/api_key", api_keyrouter);
app.use("/api/folio", foliorouter);
app.use("/api/informe", inforouter);
app.use("/api/filtro", inforouter);
app.use("/api/proyecto", proyectrouter);
app.use("/api/actividad", actrouter);
app.use("/api/firmas", firmasrouter);
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);
app.use("/api/historialInput", historialInput);

if (process.env.NODE_ENV === "production") {
  const path = await import("path");
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    console.log(path.resolve("client", "dist", "index.html"));
    res.sendFile(path.resolve("client", "dist", "index.html"));
  });
}

export default app;
