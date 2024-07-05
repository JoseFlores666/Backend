//instalar cloudinary xd y despues ya continuar
import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_APY_KEY,
  CLOUDINARY_APY_SECRET,
} from "../config.js";
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_APY_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadimage(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: replit,
  });
}
