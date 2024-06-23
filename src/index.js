import dotenv from "dotenv";
import connectDb from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDb();




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


