import https from "https";
import path  from "path";
import fs  from "fs");
import request  require("request");

const API_KEY = "hiasd12e@gmail.com_DBWnPr3F31V613842IKk6A88vy8twis6S5033Zu0aw0VrnzC8F32s4ANfzZ6dIha";

if (process.argv.length < 4) {
  console.error("Usage: node apiPDF.js <sourceFile> <destinationFile>");
  process.exit(1);
}

const SourceFile = process.argv[2];
const DestinationFile = process.argv[3];

convertDocToPdf(API_KEY, SourceFile, DestinationFile);

function convertDocToPdf(apiKey, sourceFile, destinationFile) {
  getPresignedUrl(apiKey, sourceFile).then(([uploadUrl, uploadedFileUrl]) => {
    uploadFile(sourceFile, uploadUrl).then(() =>
      performConversion(apiKey, uploadedFileUrl, destinationFile)
    );
  });
}

function getPresignedUrl(apiKey, localFile) {
  return new Promise((resolve, reject) => {
    let queryPath = `/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${path.basename(localFile)}`;
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
    }).on("error", (err) => {
      reject(err);
    });
  });
}

function uploadFile(localFile, uploadUrl) {
  return new Promise((resolve, reject) => {
    fs.readFile(localFile, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      request(
        {
          method: "PUT",
          url: uploadUrl,
          body: data,
          headers: {
            "Content-Type": "application/octet-stream",
          },
        },
        (err, response) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  });
}

function performConversion(apiKey, uploadedFileUrl, destinationFile) {
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
      downloadPdf(apiKey, json.url, destinationFile);
    });
  });

  postRequest.write(jsonPayload);
  postRequest.end();
}

function downloadPdf(apiKey, pdfUrl, destinationFile) {
  let file = fs.createWriteStream(destinationFile);
  https.get(pdfUrl, (response) => {
    response.pipe(file).on("close", () => {
      console.log(`Generated PDF file saved as "${destinationFile}".`);
    });
  }).on("error", (err) => {
    console.error(`Error downloading PDF: ${err.message}`);
  });
}
