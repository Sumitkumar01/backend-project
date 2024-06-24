import dotenv from "dotenv";
import connectDb from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})

connectDb()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`http://localhost:${process.env.PORT}`)
        })
        console.log("DataBase Connected")
    })
    .catch((error) => console.log('DataBase Connection failed', error));




/*
import express from "express";
const app = express();

; (async () => { 
    try{
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR: ", error);
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`http://localhost:${process.env.PORT}/`)
        })
    }catch(error){
        console.log(error);
        throw err
    }
})();
*/


