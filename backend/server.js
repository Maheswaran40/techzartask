import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
// app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
// app.use(cors())
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Management Backend Running Successfully",
  });
});

// Images are served by filename. Keep filenames random and never use user input as a path.
app.use("/uploads", express.static(path.resolve("uploads")));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`API running at http://localhost:${port}`)))
  .catch((err) => { console.error("Failed to start server:", err.message); process.exit(1); });
