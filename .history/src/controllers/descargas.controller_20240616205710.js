import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

export const descargarArchivo = (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.resolve(__dirname, "../public/docs/result.pdf");

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
