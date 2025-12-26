import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData } from "../controllers/userController.js";

const userRouter = express.Router();

// ✅ Health check for user routes
userRouter.get("/", (req, res) => {
  res.json({ success: true, message: "User API working" });
});

// ✅ Protected route
userRouter.get("/data", userAuth, getUserData);

export default userRouter;
