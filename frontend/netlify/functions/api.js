// netlify/functions/api.js

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Fix ESM path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically load the ESM Express handler
export const handler = async (event, context) => {
  const { handler } = await import(
    path.resolve(__dirname, "../../../backend/handler.js")
  );
  return handler(event, context);
};
