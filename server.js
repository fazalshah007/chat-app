import dotenv from "dotenv";
dotenv.config({ override: true });

import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

import authRouter from "./src/routes/auth.route.js"
import connectDB from "./src/database/db.js";
import { app, server } from "./src/lib/socket.io.js";


const port = process.env.PORT || 5001;

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

// app.use(cors({
//     origin: ["*","http://localhost:5173"],
//     credentials: true
// }))

app.use("/api/auth", authRouter)

app.get("/", (req, res) => {
    res.send(`<h1 style="width: 100%; height: 90vh; display: flex; justify-content: center; align-items: center; font-size: 50px;"> Server is running... </h1>`)
})

server.listen(port, () => {
    console.log(`server listing on PORT http://localhost:${port}`);
    connectDB();
})