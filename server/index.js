import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(cookieParser());

/* -------------------- CORS (PRODUCTION SAFE) -------------------- */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

/* -------------------- ROUTES -------------------- */
app.get("/", (req, res) => {
  res.send("API working...");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

/* -------------------- SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`✅ Server started on PORT: ${PORT}`);
});

