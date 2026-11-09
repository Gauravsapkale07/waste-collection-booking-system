import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import areaRoutes from "./routes/areaRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ success: true, message: "Waste Collection API is running" }));
app.use("/api/areas", areaRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin/stats", statsRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
