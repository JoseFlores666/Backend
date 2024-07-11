import https from "https";
import path from "path";
import fs from "fs";
import request from "request";

const API_KEY =
  "hiasd12e@gmail.com_DBWnPr3F31V613842IKk6A88vy8twis6S5033Zu0aw0VrnzC8F32s4ANfzZ6dIha";

if (process.argv.length < 4) {
  console.error("Usage: node apiPDF.js <sourceFile> <destinationFile>");
  process.exit(1);
}

const SourceFile = process.argv[2];
const DestinationFile = process.argv[3];

convertDocToPdf(API_KEY, SourceFile, DestinationFile);

a;
async function convertDocToPdf(apiKey, sourceFile, destinationFile) {
  try {
    const [uploadUrl, uploadedFileUrl] = await getPresignedUrl(
      apiKey,
      sourceFile
    );
    await uploadFile(sourceFile, uploadUrl);
    await performConversion(apiKey, uploadedFileUrl, destinationFile);
    console.log(
      `PDF conversion successful. PDF saved as "${destinationFile}".`
    );
  } catch (error) {
    console.error(`Error converting DOCX to PDF: ${error.message}`);
  }
}

function getPresignedUrl(apiKey, localFile) {
  return new Promise((resolve, reject) => {
    const queryPath = `/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${path.basename(
      localFile
    )}`;

    const reqOptions = {
      host: "api.pdf.co",
      path: encodeURI(queryPath),
      headers: { "x-api-key": apiKey },
    };

    https
      .get(reqOptions, (response) => {
        let data = "";
        response.r;
        on("data", (chunk) => {
          data += chunk;
        });
        response.data;
        on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve([json.presignedUrl, json.url]);
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        });
      })
      .on("error", (err) => {
        reject(new Error(`HTTPS request error: ${err.message}`));
      });
  });
}

function uploadFile(localFile, uploadUrl) {
  return new Promise((resolve, reject) => {
    fs.readFile(localFile, (err, data) => {
      if (err) return reject(new Error(`File read error: ${err.message}`));
      request.put(
        {
          url: uploadUrl,
          body: data,
          headers: { "Content-Type": "application/octet-stream" },
        },
        (err, response) => {
          if (err)
            return reject(new Error(`File upload error: ${err.message}`));
          resolve();
        }
      );
    });
  });
}

function performConversion(apiKey, uploadedFileUrl, destinationFile) {
  return new Promise((resolve, reject) => {
    const queryPath = `/v1/pdf/convert/from/doc`;
    const postData = JSON.stringify({
      name: path.basename(destinationFile),
      url: uploadedFileUrl,
    });

    const reqOptions = {
      host: "api.pdf.co",
      method: "POST",
      path: queryPath,
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData, "utf8"),
      },
    };

    const postRequest = https.request(reqOptions, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(
              new Error(json.message || "Unknown error during conversion")
            );
          } else {
            downloadPdf(json.url, destinationFile);
            resolve();
          }
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    });

    postRequest.on("error", (err) => {
      reject(new Error(`HTTPS request error: ${err.message}`));
    });

    postRequest.write(postData);
    postRequest.end();
  });
}

function downloadPdf(pdfUrl, destinationFile) {
  const file = fs.createWriteStream(destinationFile);
  https
    .get(pdfUrl, (response) => {
      response.pipe(file).on("close", () => {
        console.log(`Generated PDF file saved as "${destinationFile}".`);
      });
    })
    .on("error", (err) => {
      console.error(`Error downloading PDF: ${err.message}`);
    });
}
