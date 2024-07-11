import { exec } from 'child_process';
import path from 'path';

const pdfScriptPath = path.join(__dirname, '../utils/apiPDF.js');

export const generateFormSolicitud = (req, res) => {
  const {
    fecha, suministro, pc, myProyecto, myActividad, justificacion, items,
    solicitud, JefeInmediato, Validacion, Autorizo
  } = req.body;

  const command = `php backend/php-scripts/formSolicitud.php "${fecha}" "${suministro}" "${pc}" "${myProyecto}" "${myActividad}" "${justificacion}" "${JSON.stringify(items)}" "${solicitud}" "${JefeInmediato}" "${Validacion}" "${Autorizo}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Error al generar el documento');
    }

    const sourceFile = 'backend/php-scripts/formSolicitud.docx';
    const destinationFile = 'backend/php-scripts/formSolicitud.pdf';

    exec(`node ${pdfScriptPath} ${sourceFile} ${destinationFile}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send('Error al convertir el documento a PDF');
      }
      res.download(destinationFile);
    });
  });
};

export const generateOrdenTrabajo = (req, res) => {
  const {
    folio, fecha, fechaAtencion, solicita, areasoli, edificio, tipoMantenimiento,
    tipoTrabajo, tipoSolicitud, desc, obs, items
  } = req.body;

  const command = `php backend/php-scripts/ordenTrabajo.php "${folio}" "${fecha}" "${fechaAtencion}" "${solicita}" "${areasoli}" "${edificio}" "${tipoMantenimiento}" "${tipoTrabajo}" "${tipoSolicitud}" "${desc}" "${obs}" "${JSON.stringify(items)}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Error al generar el documento');
    }

    const sourceFile = 'backend/php-scripts/ordenTrabajo.docx';
    const destinationFile = 'backend/php-scripts/ordenTrabajo.pdf';

    exec(`node ${pdfScriptPath} ${sourceFile} ${destinationFile}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send('Error al convertir el documento a PDF');
      }
      res.download(destinationFile);
    });
  });
};
