import{v2 as cloudinary} from 'cloudinary'

function uploadimage(filePath){
    await cloudinary.uploader.upload(filePath)
}