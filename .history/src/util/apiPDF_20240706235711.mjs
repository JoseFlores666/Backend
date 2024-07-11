import https from "https";
import path from "path";
import fs from "fs";
import { request } from "https"; // Importar el método request desde https

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const API_KEY =
  "hiasd12e@gmail.com_DBWnPr3F31V613842IKk6A88vy8twis6S5033Zu0aw0VrnzC8F32s4ANfzZ6dIha";

if (process.argv.length < 4) {
  console.error("Usage: node apiPDF.js <sourceFile> <destinationFile>");
  process.exit(1);
}

const SourceFile = process.argv[2];
const DestinationFile = process.argv[3];

getPresignedUrl(API_KEY, SourceFile).then(([uploadUrl, uploadedFileUrl]) => {
  uploadFile(SourceFile, uploadUrl).then(() =>
    convertDocToPdf(API_KEY, uploadedFileUrl, DestinationFile)
  );
});

function getPresignedUrl(apiKey, localFile) {
  return new Promise((resolve) => {
    let queryPath = `/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${path.basename(
      localFile
    )}`;
    let reqOptions = {
      host: "api.pdf.co",
      path: encodeURI(queryPath),
      headers: { "x-api-key": apiKey },
    };
    https.get(reqOptions, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        let json = JSON.parse(data);
        resolve([json.presignedUrl, json.url]);
      });
    });
  });
}

function uploadFile(localFile, uploadUrl) {
  return new Promise((resolve) => {
    fs.readFile(localFile, (err, data) => {
      request(
        {
          method: "PUT",
          url: uploadUrl,
          body: data,
          headers: {
            "Content-Type": "application/octet-stream",
          },
        },
        () => resolve()
      );
    });
  });
}

function convertDocToPdf(apiKey, uploadedFileUrl, destinationFile) {
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
      let json = JSON.parse(data);
      let file = fs.createWriteStream(destinationFile);
      https.get(json.url, (response2) => {
        response2.pipe(file).on("close", () => {
          console.log(`Generated PDF file saved as "${destinationFile}" file.`);
        });
      });
    });
  });

  postRequest.write(jsonPayload);
  postRequest.end();
}
