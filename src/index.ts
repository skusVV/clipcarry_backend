import express, { Express } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import ejs from 'ejs';

import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user';
import { templateRoutes } from './routes/template';
import { templateRecordsRoutes } from './routes/template-record';
import { initSampleTemplates } from './models/template.model';
import { stripeRoutes } from './routes/stripe';
import { configs } from './config';
import startJobs from './tasks';

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

authRoutes(app);
userRoutes(app);
templateRoutes(app);
stripeRoutes(app);
templateRecordsRoutes(app);

const init = async () => {
    try {
        await mongoose.connect(configs.mongoURI, {
            useUnifiedTopology: true
        } as {});
        console.log('Connected');
    } catch (e) {
        console.log(e);
    }

    initSampleTemplates();
    startJobs();

    app.listen(configs.port, () => {
        console.log('Application started');
    });
};

init();
