import { S3Client } from "@aws-sdk/client-s3";
import { connectDB } from "../config/db.js";
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "../routes/userRoutes.js";
import gameRoutes from "../routes/gamesRoutes.js";

config({
  path: "./config/config.env",
});

const app = express();

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

app.use(express.json());
app.use(express({ urlencoded: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello PLAYBRUTAL");
});

//Auth Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/games", gameRoutes);

try {
  connectDB();

  app.listen(5000, () => {
    console.log("Server is up and running!");
  });
} catch (err) {
  console.error(err);
}

export default app;
