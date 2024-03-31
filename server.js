import { S3Client } from "@aws-sdk/client-s3";
import app from "./app.js";
import { connectDB } from "./config/db.js";

export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_IAM_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_IAM_USER_SECRET_ACCESS_KEY,
  },
});

try {
  connectDB();

  app.listen(5000, () => {
    console.log("Server is up and running!");
  });
} catch (error) {
  console.log(error.message);
}
