import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    gamename: {
      type: String,
      required: true,
    },
    gameImage: {
      type: String,
      required: true,
    },
    dataFile: {
      type: String,
      required: true,
    },
    frameworkFile: {
      type: String,
      required: true,
    },
    loaderFile: {
      type: String,
      required: true,
    },
    wasmFile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Game = mongoose.model("Game", schema);
