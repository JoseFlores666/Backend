import path from "path";
import fs from "fs";
import https from "https";
import request from "request";

const API_KEY = "jjfe_08@hotmail.com_FBw0jSp7ktM4AiIG43kyGHD92WK0zA5U483PHk62eH64Wd0zTBdpYGmni5id4xn2"; // Reemplaza con tu API Key de PDF.co

export const convertirArchivo = (req, res) => {
  const sourceFile = req.file.path;
  const destinationFile = path.join(
    "converted",
    `${path.parse(req.file.originalname).name}.pdf`
  );

  getPresignedUrl(API_KEY, sourceFile)
    .then(([uploadUrl, uploadedFileUrl]) => {
      uploadFile(sourceFile, uploadUrl)
        .then(() => convertDocToPdf(API_KEY, uploadedFileUrl, destinationFile))
        .then(() => {
          res.json({
            message: "El archivo PDF se ha guardado exitosamente.",
            filePath: destinationFile,
          });
        })
        .catch((err) => {
          console.error("Error al guardar el archivo PDF:", err);
          res.status(500).json({ error: "Error al guardar el archivo PDF." });
        });
    })
    .catch((err) => {
      console.error("Error al obtener la URL presignada:", err);
      res.status(500).json({ error: "Error al obtener la URL presignada." });
    });
};

function getPresignedUrl(apiKey, localFile) {
  return new Promise((resolve, reject) => {
    let queryPath = `/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${path.basename(
      localFile
    )}`;
    let reqOptions = {
      host: "api.pdf.co",
      path: encodeURI(queryPath),
      headers: { "x-api-key": apiKey },
    };
    https
      .get(reqOptions, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          try {
            let json = JSON.parse(data);
            resolve([json.presignedUrl, json.url]);
          } catch (error) {
            reject(new SyntaxError("Failed to parse JSON response: " + data));
          }
        });
        response.on("error", (err) => {
          reject(err);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

function uploadFile(localFile, uploadUrl) {
  return new Promise((resolve, reject) => {
    fs.readFile(localFile, (err, data) => {
      if (err) reject(err);
      request(
        {
          method: "PUT",
          url: uploadUrl,
          body: data,
          headers: {
            "Content-Type": "application/octet-stream",
          },
        },
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  });
}

function convertDocToPdf(apiKey, uploadedFileUrl, destinationFile) {
  return new Promise((resolve, reject) => {
    let queryPath = `/v1/pdf/convert/from/doc`;
    let jsonPayload = JSON.stringify({
      name: path.basename(destinationFile),
      url: uploadedFileUrl,
    });

    let reqOptions = {
      host: "api.pdf.co",
      method: "POST",
      path: queryPath,
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(jsonPayload, "utf8"),
      },
    };

    let postRequest = https.request(reqOptions, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        try {
          let json = JSON.parse(data);
          let file = fs.createWriteStream(destinationFile);
          https
            .get(json.url, (response2) => {
              response2.pipe(file).on("close", () => {
                console.log(
                  `Generated PDF file saved as "${destinationFile}" file.`
                );
                resolve();
              });
            })
            .on("error", (err) => {
              reject(err);
            });
        } catch (error) {
          reject(new SyntaxError("Failed to parse JSON response: " + data));
        }
      });
    });

    postRequest.on("error", (err) => {
      reject(err);
    });

    postRequest.write(jsonPayload);
    postRequest.end();
  });
}
