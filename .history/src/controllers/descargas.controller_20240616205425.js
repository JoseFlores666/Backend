import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname en tiempo de ejecución
const __dirname = dirname(fileURLToPath(import.meta.url));

// Resto del código
export const descargarArchivo = (req, res) => {
    const filePath = path.join(__dirname, "../public/docs/result.pdf");

    res.download(filePath, (err) => {
        if (err) {
            console.error("Error al descargar el archivo:", err);
            res.status(500).send("Error al descargar el archivo.");
        }
    });
};
