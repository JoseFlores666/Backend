import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import taksRoutes from "./routes/tasks.routes.js";
import { FRONTEND_URL } from "./config.js";
import solirouter from "./routes/solicitudes.routes.js";
import proyectRoutes from "./routes/proyect.routes.js";
import proyectRoutes from "./routes/act.routes.js";


const app = express();

app.use(
  cors({
    credentials: true,//Para que se pueda restablecer las cookies
    origin: FRONTEND_URL,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api", taksRoutes);
app.use("/api", solirouter);
app.use("/api", proyectRoutes);


if (process.env.NODE_ENV === "production") {
  const path = await import("path");
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    console.log(path.resolve("client", "dist", "index.html") );
    res.sendFile(path.resolve("client", "dist", "index.html"));
  });
}

export default app;
