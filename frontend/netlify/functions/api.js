// netlify/functions/api.js

import path from 'path';
import { __dirname } from '../../utils/esm-paths.js'; // no re-declaration

export const handler = async (event, context) => {
  const handlerPath = path.resolve(__dirname, '../../../backend/handler.js');
  const { handler } = await import(handlerPath);
  return handler(event, context);
};
