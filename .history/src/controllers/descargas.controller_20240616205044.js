import path from "path";

export const descargarArchivo = (req, res) => {
  // Utiliza path.resolve() correctamente para obtener la ruta absoluta
  const filePath = path.resolve(__dirname, "./doc/result.pdf");
  
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error al descargar el archivo:", err);
      res.status(500).send("Error al descargar el archivo.");
    }
  });
};
