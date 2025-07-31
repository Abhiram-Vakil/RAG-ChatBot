// netlify/functions/api.js

export const handler = async (event, context) => {
  const { handler } = await import("./backend/handler.js");
  return handler(event, context);
};
