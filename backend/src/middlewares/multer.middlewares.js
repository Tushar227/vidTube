import multer from "multer";


//Configure multer for file upload
//Set destination and filename
//Save it in the temp folder locally on our server
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

export const upload = multer ({
    storage
})