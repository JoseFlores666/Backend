import path from "path";

export const descargarArchivo = (req, res) => {
    res.download("./public/docs/result.pdf");
  
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error al descargar el archivo:", err);
      res.status(500).send("Error al descargar el archivo.");
    }
  });
};
