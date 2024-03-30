import asyncHandler from "express-async-handler";
import { User } from "../model/User.js";
import generateToken from "../utils/generateToken.js";
import { TestGame } from "../model/TestGame.js";

export const signinWithGoogle = asyncHandler(async (req, res) => {
  const { username, email, pic } = req.body;

  if (!username || !email) {
    return res.status(400).json({
      success: false,
      message: "Please fill the required fields!",
    });
  }

  try {
    let user = await User.findOne({ email: email });

    if (!user) {
      user = await User.create({
        username,
        email,
        pic,
      });

      if (user) user.save();
    }

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400);
    throw new Error("Failed to Sign in the User");
  }
});

export const saveTestGameDetaisl = asyncHandler(async (req, res) => {
  const { dataFile, frameworkFile, loaderFile, wasmFile, gamename, gameOwner } =
    req.body;

  try {
    let game = await TestGame.findOne({
      gamename: gamename,
      gameOwner: gameOwner,
    });

    if (!game) {
      game = await TestGame.create({
        dataFile,
        frameworkFile,
        loaderFile,
        wasmFile,
        gamename,
        gameOwner,
      });
    } else {
      return res.status(201).json({
        success: false,
        message: "Already game present with same name",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Press the start button after 1 min.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to load the game files",
    });
  }
});

export const getMyAllTestBuild = asyncHandler(async (req, res) => {
  const { gameOwner } = req.body;

  try {
    let games = await TestGame.find({
      gameOwner: gameOwner,
    });

    return res.status(201).json({
      success: true,
      message: "All games of users",
      games: games,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch your builds",
    });
  }
});
