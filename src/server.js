import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';

const setupServer = () => {
  const PORT = Number(env('PORT', '3000'));
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });
  app.use((req, res) => {
    res.status(404).json({
      message: 'The page NOT FOUND',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
