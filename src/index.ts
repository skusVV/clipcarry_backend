import express, { Express } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import { authRoutes } from './routes/auth';

const MONGO_URI = 'mongodb://localhost:27017/clipcarry';
const PORT = 3000;
const app: Express = express();

app.use(cors());
app.use(bodyParser.json())

authRoutes(app);

const init = async() => {
    try {
        await mongoose.connect(MONGO_URI, {});
        console.log('Connected');
    } catch (e) {
        console.log(e);
    }

    app.listen(PORT, () => {
        console.log('Application started');
    });
};

init();
