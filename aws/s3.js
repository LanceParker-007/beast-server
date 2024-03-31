import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import asyncHandler from "express-async-handler";
import { s3Client } from "../index.js";
import { TestGame } from "../model/TestGame.js";

const bucketName = "unity-games-test-bucket";

//AWS pre-signed url to upload files
export const generateUploadURL = asyncHandler(
  async (username, gamename, uniqueFileName, contentType) => {
    try {
      // console.log("here 1");
      // console.log(filename);
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `testing-builds/${username}/${gamename}/${uniqueFileName}`,
        ContentType: contentType,
      });

      const uploadURL = await getSignedUrl(s3Client, command);
      return uploadURL;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getUploadURL = asyncHandler(async (req, res) => {
  const { username, gamename, filename, fileType } = req.body;

  const uniqueFileName = `${filename}-${Date.now()}.${fileType}`;
  const uploadURL = await generateUploadURL(
    username,
    gamename,
    uniqueFileName,
    fileType
  );

  return res.json({
    success: true,
    public_id: uniqueFileName,
    signedURL: uploadURL,
  });
});

// Delete all test builds of the developer
export const removeAllMyTestBuilds = asyncHandler(async (req, res) => {
  const { gameOwner } = req.body;

  try {
    // const games = await TestGame.find({ gameOwner: gameOwner });

    // games.map((game) => {
    //   console.log(game.dataFile.key);
    //   console.log(game.frameworkFile.key);
    //   console.log(game.loaderFile.key);
    //   console.log(game.wasmFile.key);
    // });

    // Delete files from S3
    // const deletePromises = games.flatMap(async (game) => {
    //   const { dataFile, frameworkFile, loaderFile, wasmFile } = game;
    //   const publicIds = [
    //     dataFile.key,
    //     // frameworkFile.key,
    //     // loaderFile.key,
    //     // wasmFile.key,
    //   ];

    //   // console.log(publicIds);

    //   //   // publicIds.forEach(async (publicId) => {
    //   //   //   const params = {
    //   //   //     Bucket: "unity-games-test-bucket", // Replace with your S3 bucket name
    //   //   //     Key: publicId,
    //   //   //   };
    //   //   //   const data = await s3Client.send(new DeleteObjectCommand(params));
    //   //   //   console.log("Success. Object deleted.", data);
    //   //   //   return data;
    //   //   // });

    //   return publicIds.map(async (publicId) => {
    //     const params = {
    //       Bucket: "unity-games-test-bucket", // Replace with your S3 bucket name
    //       Key: publicId,
    //     };
    //     const data = await s3Client.send(new DeleteObjectCommand(params));
    //     console.log("Success. Object deleted.", data);
    //   });
    // });

    // Wait for all file deletions to complete
    // await Promise.all(deletePromises);

    // console.log("Delete all builds from DB");
    // Delete games from MongoDB
    await TestGame.deleteMany({ gameOwner: gameOwner });

    return res.status(201).json({
      success: true,
      message: "All clear, Sir!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to clear the builds",
      error: error,
    });
  }
});
