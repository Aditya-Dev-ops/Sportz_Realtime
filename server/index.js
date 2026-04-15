import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { matchRouter } from "./src/routes/matches.js";
import { teamRouter } from "./src/routes/team.js";
import { eventsRouter } from "./src/routes/event.js";
import { playerRouter } from "./src/routes/player.js";
import { sportRouter } from "./src/routes/sport.js";
import { attachWebSocketServer } from "./ws/server.js";

const app = express();
const port = Number(process.env.PORT || 8000);
const host = process.env.HOST || "0.0.0.0";
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
    origin:"*"
}))

app.use("/matches",matchRouter);
app.use("/teams",teamRouter);
app.use("/events",eventsRouter);
app.use("/players",playerRouter);
app.use("/sports",sportRouter);


app.use('/', (req , res)=>{
    res.send("Helo from server");
});

const {broadcastMatchCreated , broadcastEvent , broadcastMatchStatus , io } = attachWebSocketServer(server);
app.set("io", io);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastEvent = broadcastEvent;
app.locals.broadcastMatchStatus = broadcastMatchStatus;

server.listen(port, ()=>{
    const baseUrl = host === "0.0.0.0"? `http://${(host)}:${port}`:`http://localhost:${port}`;
    console.log(`Server is running at ${baseUrl}`);
    console.log(`Web socket server running on ${baseUrl.replace('http','socket.io')}/socket.io`);
});