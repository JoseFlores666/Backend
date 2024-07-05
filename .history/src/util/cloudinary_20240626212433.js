//instal
import{v2 as cloudinary} from 'cloudinary'

export async function uploadimage(filePath){
    return await cloudinary.uploader.upload(filePath´,{

    })
}