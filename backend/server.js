import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration - Allow frontend and extension
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:3000",
    /^chrome-extension:\/\//, // ✅ Already there
    /^moz-extension:\/\//, // ✅ Already there
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // ⬅️ ADDED
  allowedHeaders: ["Content-Type", "Authorization"], // ⬅️ ADDED
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Add OPTIONS handler for preflight requests (IMPORTANT FOR EXTENSIONS)
app.options("*", cors(corsOptions)); // ⬅️ ADDED THIS

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "QuickFill API is running! 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/profiles", profileRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 4010; // ⬅️ CHANGED FROM 4000 TO 4010
app.listen(PORT, () => {
  console.log(`🚀 QuickFill Server running on port ${PORT}`);
  console.log(`🌍 Health check: http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for extensions`);
});
