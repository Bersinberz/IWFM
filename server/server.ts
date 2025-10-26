import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";

// Routes
import userRoutes from "./routes/userRoutes";
import tankerRoutes from "./routes/tankerRoutes";
import alerts from "./routes/alertRoutes"
dotenv.config();

const app: Application = express();

// ----------------- Middleware -----------------
app.use(cors());
app.use(express.json());

// ----------------- MongoDB Connection -----------------
const MONGO_URI: string = process.env.MONGO_URI || "mongodb://localhost:27017/iwfm";

const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
      console.log("✅ MongoDB connected successfully!");
    } else {
      console.log("ℹ️ MongoDB already connected");
    }
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

// ----------------- Routes -----------------
app.use("/api/users", userRoutes);
app.use("/api/tankers", tankerRoutes);
app.use("/api/alerts", alerts)
// ----------------- Prediction Route -----------------
app.get("/api/predictions", (req: Request, res: Response) => {
  // Project root path
  const filePath = path.join(process.cwd(), "next7days_predictions.json"); // note the exact filename
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(data));
  } else {
    res.status(404).json({ error: "Prediction file not found" });
  }
});

// ----------------- Test Route -----------------
app.get("/", (req: Request, res: Response) => {
  res.send("IWFM Backend Running ✅");
});

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ----------------- Optional: Increase max listeners -----------------
process.setMaxListeners(20);