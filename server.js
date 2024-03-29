import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import app from "./app.js";

config({
  path: "./config/config.env",
});

export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_IAM_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_IAM_USER_SECRET_ACCESS_KEY,
  },
});

connectDB();

const server = app.listen(5000, () => {
  console.log("Server is up and running!");
});

export { server };
