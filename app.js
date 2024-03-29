import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";

config({
  path: "./config/config.env",
});

const app = express();

app.use(
  "*",
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express({ urlencoded: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello PLAYBRUTAL");
});

//Auth Routes
// app.use("/api/v1/user", userRoutes);

export default app;
