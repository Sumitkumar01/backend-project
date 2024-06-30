import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';




// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // uplode the file 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        // console.log("file uploaded successfull", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the uplode operation got failed
        return null;
    }
}

