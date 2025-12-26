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

/* -------------------- CORS CONFIG -------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
  process.env.FRONTEND_URL, // Vercel frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
