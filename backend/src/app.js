import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors"
import { connect } from "node:http2";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/user_route.js";
import runCodeRoute from "./routes/runCode.js";
import dotenv from "dotenv";
dotenv.config({
  path: "../.env"
});


const app = express();
const server = createServer(app)
const io = connectToSocket(server)

app.set("port",(process.env.PORT || 8000))
app.use(cors())
app.use(express.json({limit:"40kb"}))
app.use(express.urlencoded({limit:"40kb",extended:true}))
app.use(express.json());
app.use("/api/v1/users",userRoutes)
app.use("/run", runCodeRoute);

const start = async ()=>{

    const connectionDb = await mongoose.connect(process.env.MONGO_URI)

    console.log(`Mongo connected the db host: ${connectionDb.connection.host}` 
    )
    server.listen(app.get("port"), () => {
    console.log("Port 8000 is listening")
})
}
start();