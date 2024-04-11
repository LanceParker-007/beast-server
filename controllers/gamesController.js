import asyncHandler from "express-async-handler";
import { Game } from "../model/Game.js";

export const getAllPublicGames = asyncHandler(async (req, res) => {
  try {
    let games = await Game.find();

    return res.json({
      success: true,
      message: "All public games fetched successfully!",
      data: games,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Failed to fetch all public games");
  }
});

export const getGame = asyncHandler(async (req, res) => {
  const { gameId } = req.body;

  try {
    let game = await Game.findOne({ _id: gameId });

    return res.json({
      success: true,
      message: "Game files fetched successfully!",
      data: game,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Failed to fetch game files");
  }
});
