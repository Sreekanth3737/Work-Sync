import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/project_management";

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to the Project Management API",
  });
});

app.use("/api-v1", routes);

//Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});
// Error handling middleware for 404
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
