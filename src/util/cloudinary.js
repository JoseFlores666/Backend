// primer paso instalar cloudinary xd y despues ya continuar
import { v2 as cloudinary } from "cloudinary";

//mis datos del cloudinary
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const myfolder = "Imagenes INNEGO"; //nombre de mi carpeta donde guardaremos las imagenes en cloudinary

//Funcion para subir archivos a cloudinary
export async function uploadImage(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: myfolder,
    crop: "limit", // Evita que la imagen se recorte
    width: 1200, // establecemos un ancho máximo
    height: 1200, //establece un alto máximo
  });
}

//funcion para eliminar imagenes
export async function deleteImage(publicId) {
  return await cloudinary.uploader.destroy(publicId);
}
