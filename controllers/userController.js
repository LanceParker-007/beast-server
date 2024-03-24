import asyncHandler from "express-async-handler";
import { User } from "../model/User.js";
import generateToken from "../utils/generateToken.js";

export const signinWithGoogle = asyncHandler(async (req, res) => {
  const { name, email, pic } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Please fill the required fields!",
    });
  }

  try {
    let user = await User.findOne({ email: email });

    if (!user) {
      user = await User.create({
        name,
        email,
        pic,
      });

      if (user) user.save();
    }

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400);
    throw new Error("Failed to Sign in the User");
  }
});
