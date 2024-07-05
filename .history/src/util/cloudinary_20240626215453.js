//instalar cloudinary xd y despues ya continuar
import{v2 as cloudinary} from 'cloudinary'
// import {CLOUDINARY_CLOUD_NAME,CLOUDINARY_APY_KEY,CLOUDINARY_APY_SECRET} from '../config.js'
cloudinary.config({
    cloud_name: 'dxmhlxdxo',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
export async function uploadimage(filePath){
    return await cloudinary.uploader.upload(filePath,{
        folder: replit
    })
}