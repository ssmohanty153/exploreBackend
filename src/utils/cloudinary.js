import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLODINARY_CLOUDE_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET
});


const uploadOnCloudnary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }

        //upload the file uin cloudinary
        const responce = await cloudinary.v2.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully

        console.log("file is upload on successfully", responce.url);
        return responce
    } catch (error) {
        fs.unlinkSync(localFilePath)//remove loacally temperorry saved file

        return null
    }
}
cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    { public_id: "olympic_flag" },
    function (error, result) { console.log(result); });


export default uploadOnCloudnary