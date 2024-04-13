import { S3Client } from "@aws-sdk/client-s3";
import { connectDB } from "../config/db.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "../routes/userRoutes.js";
import gameRoutes from "../routes/gamesRoutes.js";
import { log } from "console";

config({
  path: "./config/config.env",
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or pass your frontend url here:http://localhost:5173
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Add this line
});

app.use(
  cors({
    origin: "*",
  })
);

export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_IAM_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_IAM_USER_SECRET_ACCESS_KEY,
  },
});

// Middlewares
app.use(express.json());
app.use(express({ urlencoded: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello PLAYBRUTAL");
});

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/games", gameRoutes);

// Socket-io implementation starts
const viewersLists = {};

io.on("connection", (socket) => {
  // console.log("A client connected!");

  // Handle user joining a game room
  socket.on("join-game-chat", (user, urlUserId, gameId) => {
    const gameChatRoomId = urlUserId + gameId;
    socket.join(gameChatRoomId);
    // console.log(`User ${user?.username} joined room ${gameChatRoomId}`);

    // Add the user to the viewers list for the game room
    if (!viewersLists[gameChatRoomId]) {
      viewersLists[gameChatRoomId] = [];
    }
    const exist = viewersLists[gameChatRoomId]?.find((viewer) => {
      return viewer.userId === user?._id;
    });
    if (!exist && urlUserId !== user?._id) {
      viewersLists[gameChatRoomId].push({
        userId: user?._id,
        username: user?.username,
        socketId: socket.id,
      });
    }
    // Broadcast the updated viewers list to all clients in the room
    io.to(gameChatRoomId).emit("update-viewers", viewersLists);
  });

  // Listen for 'sendInvitation' event from the client
  socket.on(
    "send-invitation-to-viewer",
    ({ recipientSocketId, invitationUrl, gameLobbyCode }) => {
      // console.log(invitationUrl, gameLobbyCode);
      // Emit the invitation event to the recipient's socket
      io.to(recipientSocketId).emit("invitation-from-steamer", {
        invitationUrl,
        gameLobbyCode,
      });
    }
  );

  // Handle user leaving a game room
  socket.on("leave-game-chat", (user, urlUserId, gameId) => {
    const gameChatRoomId = urlUserId + gameId;
    // console.log(`User ${user?.username} left room ${gameChatRoomId}`);

    // Remove the user from the viewers list for the game room
    if (viewersLists[gameChatRoomId]) {
      viewersLists[gameChatRoomId] = viewersLists[gameChatRoomId].filter(
        (viewer) => viewer.userId !== user?._id
      );
    }

    // Broadcast the updated viewers list to all clients in the room
    io.to(gameChatRoomId).emit("update-viewers", viewersLists);
  });

  // Handle client-disconnect
  socket.on("disconnect", (user, urlUserId, gameId) => {
    socket.emit("leave-game-chat", user, urlUserId, gameId);
    socket.disconnect();
  });
});
// Socket-io implementation ends

try {
  connectDB();
  server.listen(5000, () => {
    console.log("Server is up and running!");
  });
} catch (err) {
  console.error(err);
}

export default app;
