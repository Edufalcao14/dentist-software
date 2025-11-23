import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AppContext } from '../libs/context';

export const createRestApp = (context: AppContext) => {
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    // TODO: Add routes here

    return app;
};
