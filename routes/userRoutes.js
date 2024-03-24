import express from "express";
import { signinWithGoogle } from "../controllers/UserController.js";

const router = express.Router();

router.post("/signinwithgoogle", signinWithGoogle);

export default router;
