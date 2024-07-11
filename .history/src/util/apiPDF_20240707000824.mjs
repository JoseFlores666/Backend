import https from "https";
import path from "path";
import fs from "fs";
import request from "request";

const API_KEY = "hiasd12e@gmail.com_DBWnPr3F31V613842IKk6A88vy8twis6S5033Zu0aw0VrnzC8F32s4ANfzZ6dIha";

if (process.argv.length < 4) {
  console.error("Usage: node apiPDF.mjs <sourceFile> <destinationFile>");
  process.exit(1);
}

const SourceFile = process.argv[2];
const DestinationFile = process.argv[3];

const getPresignedUrl = (apiKey, localFile) => {
  return new Promise((resolve, reject) => {
    let queryPath = `/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${path.basename(localFile)}`;
    let reqOptions = {
      host: "api.pdf.co",
      path: encodeURI(queryPath),
      headers: { "x-api-key": apiKey },
    };

    const requestCallback = (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        let json;
        try {
          json = JSON.parse(data);
        } catch (error) {
          reject(error);
        }
        resolve([json.presignedUrl, json.url]);
      });
    };

    const req = https.get(reqOptions, requestCallback);
    req.on("error", reject);
  });
};

const uploadFile = (localFile, uploadUrl) => {
  return new Promise((resolve, reject) => {
    fs.readFile(localFile, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const options = {
        method: "PUT",
        url: uploadUrl,
        body: data,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      };

      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  });
};

const convertDocToPdf = (apiKey, uploadedFileUrl, destinationFile) => {
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

    const postRequest = https.request(reqOptions, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        let json;
        try {
          json = JSON.parse(data);
        } catch (error) {
          reject(error);
          return;
        }
        const file = fs.createWriteStream(destinationFile);
        https.get(json.url, (response2) => {
          response2.pipe(file).on("close", () => {
            console.log(`Generated PDF file saved as "${destinationFile}" file.`);
            resolve();
          });
        });
      });
    });

    postRequest.on("error", reject);
    postRequest.write(jsonPayload);
    postRequest.end();
  });
};

(async () => {
  try {
    const [uploadUrl, uploadedFileUrl] = await getPresignedUrl(API_KEY, SourceFile);
    await uploadFile(SourceFile, uploadUrl);
    await convertDocToPdf(API_KEY, uploadedFileUrl, DestinationFile);
  } catch (error) {
    console.error("Error converting to PDF:", error);
  }
})();
