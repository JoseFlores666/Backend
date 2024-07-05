const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/download-file", (req, res) => {
  res.download("./");
});

// Nueva ruta para descargar archivo desde una URL local
app.get("/download-external-file", async (req, res) => {
  const url = "http://localhost/Tutorial2_OpentbsWordPHP-master/result.pdf";

  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream"
    });

    res.setHeader('Content-Disposition', 'attachment; filename="result.pdf"');
    response.data.pipe(res);
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
    res.status(500).send("Error al descargar el archivo.");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("El servidor inició en el puerto ${PORT}");
});