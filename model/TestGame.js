import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    dataFile: {
      filePublicId: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
        required: true,
      },
      key: {
        type: String,
        required: true,
      },
    },
    frameworkFile: {
      filePublicId: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
        required: true,
      },
      key: {
        type: String,
        required: true,
      },
    },
    loaderFile: {
      filePublicId: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
        required: true,
      },
      key: {
        type: String,
        required: true,
      },
    },
    wasmFile: {
      filePublicId: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
        required: true,
      },
      key: {
        type: String,
        required: true,
      },
    },
    gamename: {
      type: String,
      required: true,
      unique: true,
    },
    gameOwner: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const TestGame = mongoose.model("TestGame", schema);
