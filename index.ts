
import express, { Express, Request, Response, Application } from 'express';
import { connectDB } from './db/conn';
import { router as eventRoutes } from './routes/events';
import cors from 'cors';
import bodyParser from 'body-parser';

const app: Application = express();
const port = process.env.PORT || 8000;



const corsOptions = {
    origin: ['https://yensambrama.vercel.app', 'http://localhost:3000'],
};
app.use(cors(corsOptions)); // Enable CORS for all routes

app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

connectDB();

app.use('/api/event', eventRoutes);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
