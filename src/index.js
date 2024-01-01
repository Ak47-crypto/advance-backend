import "dotenv/config";
import express from "express";
import connecDb from "./db/index.db.js";
import {app} from './app.js'
connecDb()
.then((res)=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`Server started on host http://localhost:${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(err)
})

