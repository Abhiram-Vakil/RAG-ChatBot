import express from "express";
import "dotenv/config";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

const allowedOrigins = ["https://flourishing-sherbet-ef1c76.netlify.app"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin: " + origin));
    }
  },
})); // Enable CORS for all routes
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/chat", chatRoutes);
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000} http://localhost:${process.env.PORT || 5000}`);
});

export default app;
