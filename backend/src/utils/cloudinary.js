import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

//Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Function to upload a file on Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    //if there's no localFilePath, we return null
    if (!localFilePath) return null;

    //Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(
      "File uploaded successfully on Cloudinary. File src: ",
      response.url
    );

    //after uploading file, we delete it from our local storage
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    //if something is wrong, we remove it from our local storage
    fs.unlinkSync(localFilePath);
    return null;
  }
};

//delete from cloudinary incase of errors so that it doesnt consume space on the cloud
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(
      "File deleted successfully from Cloudinary. Public ID: ",
      publicId
    );
  } catch (error) {
    console.log("Error deleting file from Cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
