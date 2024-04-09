import express from "express";
import { getAllPublicGames, getGame } from "../controllers/gamesController.js";

const router = express.Router();

router.get("/get-all-public-games", getAllPublicGames);

router.post("/get-game", getGame);

export default router;
