import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import axios from "axios";

export const descargarArchivo = (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.resolve(__dirname, "../doc/result.pdf");

  try {
    if (fs.existsSync(filePath)) {
      res.download(filePath, (err) => {
        if (err) {
          console.error("Error al descargar el archivo:", err);
          res.status(500).send("Error al descargar el archivo.");
        }
      });
    } else {
      console.error("El archivo no existe:", filePath);
      res.status(404).send("El archivo no existe.");
    }
  } catch (err) {
    console.error("Error al verificar el archivo:", err);
    res.status(500).send("Error al verificar el archivo.");
  }
};

export const descargarArchivoExterno = async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const url =
    "http://localhost/Tutorial2_OpentbsWordPHP-master/formResul.pdf";
  const downloadPath = path.resolve(__dirname, "../doc/result.pdf");

  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(downloadPath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      res.download(downloadPath, "result.pdf", (err) => {
        if (err) {
          console.error("Error al descargar el archivo:", err);
          res.status(500).send("Error al descargar el archivo.");
        } else {
          // Eliminar el archivo después de la descarga si es necesario
          fs.unlinkSync(downloadPath);
        }
      });
    });

    writer.on("error", (err) => {
      console.error("Error al escribir el archivo:", err);
      res.status(500).send("Error al escribir el archivo.");
    });
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
    res.status(500).send("Error al descargar el archivo.");
  }
};
