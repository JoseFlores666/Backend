import{v2 as cloudinary} from 'cloudinary'

function uploadimage(filePath){
    return await cloudinary.uploader.upload(filePath)
}