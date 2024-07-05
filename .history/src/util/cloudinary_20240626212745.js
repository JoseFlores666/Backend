//instalar cloudinary xd y despues ya continuar
import{v2 as cloudinary} from 'cloudinary'
cloudinary.config({
    cloud_name: '<your_cloud_name>',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
export async function uploadimage(filePath){
    return await cloudinary.uploader.upload(filePath,{
        folder: replit
    })
}