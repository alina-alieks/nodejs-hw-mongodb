import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import { env } from './utils/env.js';
import routerContacts from './routers/contacts.js';
import routerAuth from './routers/auth.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import { PUBLIC_UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const setupServer = () => {
  const PORT = Number(env('PORT', '3000'));
  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  const app = express();

  app.use(logger);

  app.use(cors());

  app.use(cookieParser());
  app.use('/api-docs', swaggerDocs());

  app.use(routerAuth);
  app.use(routerContacts);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
