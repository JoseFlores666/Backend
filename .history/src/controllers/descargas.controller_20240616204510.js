
import path from "path";

export const descargarArchivo = (req, res) => {
    const filePath = path.resolve( "../resu cFlt.pdf");
    res.download(filePath, (err) => {
        if (err) {
            console.error("Error al descargar el archivo:", err);
            res.status(500).send("Error al descargar el archivo.");
        }
    });
};
