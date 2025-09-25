// env setup - must be first
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import { inngest , functions } from './inngest/index.js';
import{serve} from 'inngest/express';
import {clerkMiddleware} from '@clerk/express'
import userRouter from './routes/userRoutes.js';
import cloudinary, { configureCloudinary } from './configs/cloudinary.js';
// Configure Cloudinary after environment variables are loaded
configureCloudinary();

await connectDB();

// express setup
const app = express();

app.use(express.json());
app.use(cors())
app.use(clerkMiddleware());

app.get('/',(req,res)=>res.send('Server is Running Successfully.'))
app.use('/api/inngest',serve({ client: inngest, functions })) // add this endpoint while connecting apps in inngest (after deploying the server on vercel i.e server link/api/inngest)
app.use('/api/user',userRouter)

const PORT = process.env.PORT || 5000;

// console.log('imagekit public key',process.env.IMAGEKIT_PUBLIC_KEY)
// console.log('imagekit private key',process.env.IMAGEKIT_PRIVATE_KEY)
// console.log('imagekit urlEndpoint',process.env.IMAGEKIT_URL_ENDPOINT)

// Debug Cloudinary environment variables
// console.log('Cloudinary cloud name:', process.env.CLOUDINARY_CLOUD_NAME)
// console.log('Cloudinary API key:', process.env.CLOUDINARY_API_KEY)
// console.log('Cloudinary API secret:', process.env.CLOUDINARY_API_SECRET)

app.listen(PORT,console.log(`server is running on the port : ${PORT}`))