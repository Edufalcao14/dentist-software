import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AppContext } from '../libs/context';

export const createRestApp = (context: AppContext): Router => {
  const router = Router();

  router.use(cors());
  router.use(helmet());
  router.use(express.json());

  router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // TODO: Add routes here

  return router;
};
