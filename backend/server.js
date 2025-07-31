import express from "express";
import "dotenv/config";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/chat", chatRoutes);
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000} http://localhost:${process.env.PORT || 5000}`);
});

export default app;
