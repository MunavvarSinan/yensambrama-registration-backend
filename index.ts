
import express, { Express, Request, Response, Application } from 'express';
import { connectDB } from './db/conn';
import { router as eventRoutes } from './routes/events';
import cors from 'cors';

const app: Application = express();
const port = process.env.PORT || 8000;
// Define your frontend domain
const allowedOrigins = ['http://localhost:3000', 'https://yensambrama.vercel.app/'];

const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(cors(corsOptions));
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/event', eventRoutes);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
