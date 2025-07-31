// netlify/functions/api.js

const path = require("path");
const { fileURLToPath } = require("url");
const { dirname } = require("path");

// Fix ESM path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically load the ESM Express handler
exports.handler = async (event, context) => {
  const { handler } = await import(
    path.resolve(__dirname, "../../../backend/handler.js")
  );
  return handler(event, context);
};
