import serverless from "serverless-http";
import app from "./backend/index.js";

export const handler = serverless(app);