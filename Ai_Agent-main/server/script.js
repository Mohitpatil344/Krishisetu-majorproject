import {v2 as cloudinary} from 'cloudinary';
import express from 'express';
import multer from 'multer';

const app = express();
const router = express.Router();
app.use(express.json());

cloudinary.config({
    cloud_name: 'dvftjzzye',
    api_key: '589481272175751',
    api_secret: 'WHcz2Mu_GJ13-yaNFZ0cP52W188'
});


export async function uploadImage(req, res) {
    try {
        const file = req.body.file; 
        const result = await cloudinary.uploader.upload(file, {
            folder: 'images',
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        });
        res.status(200).json({
            message: 'Image uploaded successfully',
            url: result.secure_url,
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            message: 'Failed to upload image',
            error: error.message,
        });
    }
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


router.post('/upload', upload.single('images'), uploadImage);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

