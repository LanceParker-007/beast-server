import express from "express";
import {
  signinWithGoogle,
  saveTestGameDetaisl,
  getMyAllTestBuild,
  ifGamenameAlreadyPresent,
} from "../controllers/userController.js";
import { getUploadURL, removeAllMyTestBuilds } from "../aws/s3.js";

const router = express.Router();

router.post("/signin-with-google", signinWithGoogle);

router.post("/get-presigned-url-for-test-game", getUploadURL);

router.post("/if-gamename-already-present", ifGamenameAlreadyPresent);

router.post("/save-test-game-details", saveTestGameDetaisl);

router.post("/remove-all-test-builds", removeAllMyTestBuilds);

router.post("/get-all-test-builds", getMyAllTestBuild);

export default router;
