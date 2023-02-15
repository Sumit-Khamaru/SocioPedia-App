import expres from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDataBase } from './database.js';
import { register } from "./controllers/auth.js";
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import { createPost } from "./controllers/post.js";
import { verifyToken } from "./middlewares/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = expres();
app.use(expres.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/assets", expres.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });
/* API CALLS*/
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE / DATABASE SETUP */
const PORT = process.env.PORT || 6001;
connectDataBase();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
app.listen(PORT, () => {
    console.log(`PORT is Working on ${process.env.PORT}`);
});

// "mongodb+srv://dummyUser:dummyUser@cluster0.xqhdurc.mongodb.net/?retryWrites=true&w=majority"