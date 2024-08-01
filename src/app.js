import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import solirouter from "./routes/solicitudes.routes.js";
import abonorouter from "./routes/abono.routes.js";
import inforouter from "./routes/infor.routes.js";
import proyectrouter from "./routes/proyect.routes.js";
import actrouter from "./routes/act.routes.js";
import foliorouter from "./routes/folio.routes.js";
import firmasrouter from "./routes/firmas.routes.js";
import api_keyrouter from "./routes/api_key.routes.js";
import historialInput from "./routes/historialInput.routes.js";
import tecnicoroutes from "./routes/tecnico.routes.js";
import estadosRouter from "./routes/estados.routes.js";
import historialSoliRoutes from "./routes/historialSoli.routes.js";
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
app.use("/api/historialInput", historialInput);
app.use("/api/tecnicos", tecnicoroutes);
app.use("/api/estados", estadosRouter);
app.use("/api/hisorialSolicitud", historialSoliRoutes);

if (process.env.NODE_ENV === "production") {
  const path = await import("path");
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    console.log(path.resolve("client", "dist", "index.html"));
    res.sendFile(path.resolve("client", "dist", "index.html"));
  });
}

export default app;
