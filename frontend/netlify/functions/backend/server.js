import express from "express";
import "dotenv/config";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get("/api/chat", (req, res) => {
  res.send("Hello World!");
});
console.log("chatRoutes is:", chatRoutes);
// app.use("/api/chat", chatRoutes);

export default app;
