import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import { apiError } from "./apiError.js";
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_KEY_SECREATE,
    secure: true
  });

const handleCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    if(response.url)
    fs.unlinkSync(localFilePath);
    return response.url;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    throw new apiError(500,"Something went wrong")
  }
};
export { handleCloudinary };
