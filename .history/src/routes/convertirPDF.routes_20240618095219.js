import { Router } from 'express';
import { exec } from 'child_process';
import path from 'path';

const router = Router();

router.post('/convertir', (req, res) => {
    const { sourceFile, destinationFile } = req.body;

    const sourceFilePath = path.resolve(__dirname, '..', 'uploads', sourceFile);
    const destinationFilePath = path.resolve(__dirname, '..', 'uploads', destinationFile);

    exec(`node ${path.resolve(__dirname, '..', 'api', 'apiPDF.js')} ${sourceFilePath} ${destinationFilePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return res.status(500).send('Error converting document');
        }

        res.send('Conversion successful');
    });
});

export default router;
