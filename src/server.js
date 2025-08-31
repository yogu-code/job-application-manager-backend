import express from 'express';
import bodyParser from 'body-parser';
import pkg from "body-parser";
import dotenv from 'dotenv';
import connectDB from './config/db.conf.js';
import cors from 'cors';

import jobRoutes from './route/Job.route.js';


const { json } = pkg;
dotenv.config(
    
);
connectDB();
const app = express();
const PORT = process.env.PORT 
app.use(
  cors({
    origin: "http://localhost:3000", // your Next.js frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(json());
app.use(bodyParser.urlencoded({ extended: true }));

//route cofnig
app.use("/api/jobs", jobRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});