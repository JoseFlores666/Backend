import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiKey = 'hiasd12e@gmail.com_DBWnPr3F31V613842IKk6A88vy8twis6S5033Zu0aw0VrnzC8F32s4ANfzZ6dIha'; 

export const generateFormSolicitud = (req, res) => {
  const {
    fecha,
    suministro,
    pc,
    myProyecto,
    myActividad,
    justificacion,
    items,
    solicitud,
    JefeInmediato,
    Validacion,
    Autorizo,
  } = req.body;
  const phpScriptPath = path.join(
    __dirname,
    "../php-scripts/formSolicitud.php"
  );
  console.log(phpScriptPath);
  const args = [
    fecha,
    suministro,
    pc,
    myProyecto,
    myActividad,
    justificacion,
    JSON.stringify(items), // Convertir items a JSON para pasar como argumento
    solicitud,
    JefeInmediato,
    Validacion,
    Autorizo,
  ];

  const command = `php ${phpScriptPath} ${args.join(" ")}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing PHP script: ${stderr}`);
      return res.status(500).send(`Error generating formSolicitud: ${stderr}`);
    }

    const nodeScriptPath = path.join(__dirname, "../util/apiPDF.js");

    const pdfCommand = `node ${nodeScriptPath} formSolicitud.docx formResult.pdf`;

    exec(pdfCommand, (pdfError, pdfStdout, pdfStderr) => {
      if (pdfError) {
        console.error(`Error converting to PDF: ${pdfStderr}`);
        return res.status(500).send(`Error converting to PDF: ${pdfStderr}`);
      }

      res.download(
        path.join(__dirname, "../formResult.pdf"),
        (downloadError) => {
          if (downloadError) {
            console.error(`Error sending PDF to client: ${downloadError}`);
            return res
              .status(500)
              .send(`Error sending PDF to client: ${downloadError}`);
          }
        }
      );
    });
  });
};

export const generateOrdenTrabajo = (req, res) => {
  const {
    folio,
    fecha,
    fechaAtencion,
    solicita,
    areasoli,
    edificio,
    tipoMantenimiento,
    tipoTrabajo,
    tipoSolicitud,
    desc,
    obs,
    items,
  } = req.body;

  console.log("Items from request:", items);

  // Crear un objeto con todos los datos
  const data = {
    folio,
    fecha,
    fechaAtencion,
    solicita,
    areasoli,
    edificio,
    tipoMantenimiento,
    tipoTrabajo,
    tipoSolicitud,
    desc,
    obs,
    items,
  };

  console.log(__dirname);
  // Crear un archivo temporal para guardar los datos JSON
  const tempFilePath = path.join(__dirname, "../temp_data.json");
  fs.writeFileSync(tempFilePath, JSON.stringify(data), "utf8");

  const phpScriptPath = path.join(__dirname, "../php-scripts/ordenTrabajo.php");
  const command = `php ${phpScriptPath} ${tempFilePath}`;

  console.log("Generated command:", command);
  exec(command, (error, stdout, stderr) => {
    // Eliminar el archivo temporal después de la ejecución
    fs.unlinkSync(tempFilePath);

    if (error) {
      console.error(`Error executing PHP script: ${stderr}`);
      return res.status(500).send(`Error generating ordenTrabajo: ${stderr}`);
    }

    console.log(`PHP script output: ${stdout}`);

    const nodeScriptPath = path.join(__dirname, "../util/apiPDF.js");
    const pdfCommand = `node ${nodeScriptPath} ordenTrabajo.docx ordenResult.pdf`;

    exec(pdfCommand, (pdfError, pdfStdout, pdfStderr) => {
      if (pdfError) {
        console.error(`Error converting to PDF: ${pdfStderr}`);
        return res.status(500).send(`Error converting to PDF: ${pdfStderr}`);
      }

      res.download(
        path.join(__dirname, "../ordenResult.pdf"),
        (downloadError) => {
          if (downloadError) {
            console.error(`Error sending PDF to client: ${downloadError}`);
            return res
              .status(500)
              .send(`Error sending PDF to client: ${downloadError}`);
          }
        }
      );
    });
  });
};
