import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
/*
app.use(cors({
    origin: 'http://localhost:8000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
*/
app.use(cors()); // to allow all origins

app.use(express.json()); // to support JSON-encoded bodies

app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use(express.static('public')); // to serve static files

app.use(cookieParser()); // to support cookies


// routes 

import userRiuter from './routes/user.routes.js'


// routes declaration 

app.use("/api/v1/users", userRiuter)

export { app }