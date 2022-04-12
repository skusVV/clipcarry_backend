import express, { Express } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user';
import { templateRoutes } from './routes/template';
import { templateRecordsRoutes } from './routes/template-record';

const MONGO_URI = 'mongodb://localhost:27017/clipcarry';
const PORT = 3001;
const app: Express = express();

app.use(cors());
app.use(bodyParser.json())

authRoutes(app);
userRoutes(app);
templateRoutes(app);
templateRecordsRoutes(app);

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
