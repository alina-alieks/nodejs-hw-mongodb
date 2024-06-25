import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import Contact from './db/models/Contact.js';
import { getAllContacts, getContactByID } from './services/contacts.js';

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

  app.get('/contacts', async (req, res) => {
    try {
      const data = await getAllContacts();
      res.json({
        status: 200,
        message: 'Successfully found contacts',
        data,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactByID(contactId);
      if (!contact) {
        res.status(404).json({
          message: `Contact with id ${contactId} not found`,
        });
        return;
      }
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}`,
        data: contact,
      });
    } catch (error) {
      if (error.message.includes('Cast to ObjectId failed')) {
        error.status = 404;
      }
      const { status = 500 } = error;
      res.status(status).json({
        message: error.message,
      });
    }
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
