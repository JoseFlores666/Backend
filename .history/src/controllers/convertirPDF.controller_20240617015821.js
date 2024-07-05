import path from 'path';
import fs from 'fs';
import https from 'https';
import request from 'request';

const API_KEY = "tu_api_key_de_pdf.co";

export const convertirArchivo = (req, res) => {
    const sourceFile = req.file.path;
    const destinationFile = path.join('converted', `${path.parse(req.file.originalname).name}.pdf`);

    getPresignedUrl(API_KEY, sourceFile)
        .then(([uploadUrl, uploadedFileUrl]) => {
            uploadFile(sourceFile, uploadUrl)
                .then(() => convertDocToPdf(API_KEY, uploadedFileUrl, destinationFile))
                .then(() => {
                    res.json({ message: "El archivo PDF se ha guardado exitosamente.", filePath: destinationFile });
                })
                .catch(err => {
                    console.error("Error al guardar el archivo PDF:", err);
                    res.status(500).json({ error: "Error al guardar el archivo PDF." });
                });
        })
        .catch(err => {
            console.error("Error al obtener la URL presignada:", err);
            res.status(500).json({ error: "Error al obtener la URL presignada." });
        });
};

function getPresignedUrl(apiKey, localFile) {
    return new Promise((resolve, reject) => {
        let queryPath = `/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name
