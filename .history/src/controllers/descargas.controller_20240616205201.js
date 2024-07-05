import path from "path";

export const descargarArchivo = (req, res) => {
    res.download("./public/docs/result.pdf");
  
};
