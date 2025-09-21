import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './configs/db.js';
import { inngest , functions } from './inngest/index.js';


// env setup
config({path:'.env'});

await connectDB();

// express setup
const app = express();

app.use(express.json());
app.use(cors())

app.get('/',(req,res)=>res.send('Server is Running Successfully.'))
app.use('/api/inngest',serve({ client: inngest, functions }))

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`server is running on the port : ${PORT}`))