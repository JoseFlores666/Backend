const descargarArchivo = (req, res) => {
    const filePath = "/ruta/completa/al/archivo/result.pdf";
    res.download(filePath, (err) => {
        if (err) {
            console.error("Error al descargar el archivo:", err);
            res.status(500).send("Error al descargar el archivo.");
        }
    });
};
