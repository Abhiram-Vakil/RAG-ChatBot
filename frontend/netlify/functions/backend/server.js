import express from "express";
import "dotenv/config";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get("/hel", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/chat", chatRoutes);

export default app;
