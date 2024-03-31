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

connectDB();

const startServer = async () => {
  try {
    const server = app.listen(5000, () => {
      console.log("Server is up and running!");
    });

    // Optionally, you can handle graceful shutdown here
    const signals = ["SIGTERM", "SIGINT"];
    for (const signal of signals) {
      process.on(signal, async () => {
        console.log(`Received signal ${signal}, shutting down...`);
        await server.close();
        process.exit(0);
      });
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
export default startServer;
