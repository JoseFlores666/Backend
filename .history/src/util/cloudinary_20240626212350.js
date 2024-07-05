import{v2 as cloudinary} from 'cloudinary'

async function uploadimage(filePath){
    return await cloudinary.uploader.upload(filePath)
}