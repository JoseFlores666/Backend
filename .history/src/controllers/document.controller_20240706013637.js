import https from 'https';
import path from 'path';
import fs from 'fs';
import request from 'request';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.PDF_API_KEY;

export function getPresignedUrl(localFile) {
  return new Promise((resolve, reject) => {
    let queryPath = `/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${path.basename(localFile)}`;
    let reqOptions = {
      host: "api.pdf.co",
      path: encodeURI(queryPath),
      headers: { "x-api-key": API_KEY },
    };
    https.get(reqOptions, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        let json = JSON.parse(data);
        if (json.presignedUrl && json.url) {
          resolve([json.presignedUrl, json.url]);
        } else {
          reject(new Error('Failed to get presigned URL'));
        }
      });
    }).on("error", (e) => {
      reject(e);
    });
  });
}

export function uploadFile(localFile, uploadUrl) {
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

export function convertDocToPdf(uploadedFileUrl, destinationFile) {
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
        "x-api-key": API_KEY,
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
            resolve();
          });
        });
      });
    });

    postRequest.write(jsonPayload);
    postRequest.end();
  });
}
